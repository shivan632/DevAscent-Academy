import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCouponDto, DiscountType } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CouponsService {
  private readonly logger = new Logger(CouponsService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Audit Logging Helper ───────────────────────────────────────────────────
  private async logAction(params: {
    adminId: string;
    action: string;
    targetId?: string;
    targetType?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          adminId: params.adminId,
          action: params.action,
          targetId: params.targetId,
          targetType: params.targetType || 'Coupon',
          metadata: params.metadata ?? {},
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Failed to write audit log: ${err.message}`);
    }
  }

  // ─── Create Coupon ──────────────────────────────────────────────────────────
  async createCoupon(
    adminId: string,
    dto: CreateCouponDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const formattedCode = dto.code.trim().toUpperCase();

    // Check duplicate
    const existing = await this.prisma.coupon.findUnique({
      where: { code: formattedCode },
    });
    if (existing) {
      throw new ConflictException(`Coupon code '${formattedCode}' already exists`);
    }

    // Verify course if specified
    if (dto.courseId) {
      const course = await this.prisma.course.findUnique({
        where: { id: dto.courseId },
      });
      if (!course) {
        throw new NotFoundException(`Course with ID ${dto.courseId} not found`);
      }
    }

    const coupon = await this.prisma.coupon.create({
      data: {
        code: formattedCode,
        description: dto.description?.trim() || null,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        maxUses: dto.maxUses ?? 1,
        usedCount: 0,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        isActive: true,
        courseId: dto.courseId || null,
        isAutoApply: false, // Strict rule: never auto-apply by default
        createdById: adminId,
      },
      include: {
        course: { select: { id: true, title: true, slug: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    await this.logAction({
      adminId,
      action: 'COUPON_CREATED',
      targetId: coupon.id,
      targetType: 'Coupon',
      metadata: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxUses: coupon.maxUses,
        courseId: coupon.courseId,
      },
      ipAddress,
      userAgent,
    });

    return coupon;
  }

  // ─── List / Search Coupons (Admin) ──────────────────────────────────────────
  async getCoupons(query: {
    status?: string;
    search?: string;
    courseId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.CouponWhereInput = {};
    const now = new Date();

    if (query.status === 'active') {
      where.isActive = true;
      where.AND = [
        { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
        // usedCount < maxUses check is handled or filtered
      ];
    } else if (query.status === 'expired') {
      where.expiresAt = { lte: now };
    } else if (query.status === 'inactive') {
      where.isActive = false;
    }

    if (query.courseId) {
      where.courseId = query.courseId;
    }

    if (query.search) {
      const s = query.search.trim().toUpperCase();
      where.OR = [
        { code: { contains: s, mode: 'insensitive' } },
        { description: { contains: query.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [coupons, total, allCoupons] = await Promise.all([
      this.prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          course: { select: { id: true, title: true, slug: true } },
          createdBy: { select: { id: true, name: true, email: true } },
          _count: { select: { payments: true } },
        },
      }),
      this.prisma.coupon.count({ where }),
      this.prisma.coupon.findMany({
        select: {
          id: true,
          isActive: true,
          maxUses: true,
          usedCount: true,
          expiresAt: true,
          payments: {
            where: { status: 'PAID' },
            select: { discountApplied: true },
          },
        },
      }),
    ]);

    // Compute stats
    let activeCouponsCount = 0;
    let totalRedemptions = 0;
    let totalDiscountGivenInPaise = 0;

    for (const c of allCoupons) {
      const isNotExpired = !c.expiresAt || c.expiresAt > now;
      const hasUsesLeft = c.usedCount < c.maxUses;
      if (c.isActive && isNotExpired && hasUsesLeft) {
        activeCouponsCount++;
      }
      totalRedemptions += c.usedCount;
      for (const p of c.payments) {
        totalDiscountGivenInPaise += p.discountApplied || 0;
      }
    }

    return {
      coupons,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalCoupons: allCoupons.length,
        activeCoupons: activeCouponsCount,
        totalRedemptions,
        totalDiscountGivenInPaise,
      },
    };
  }

  // ─── Get Single Coupon ──────────────────────────────────────────────────────
  async getCouponById(id: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true, slug: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        payments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, name: true, email: true } },
            course: { select: { id: true, title: true } },
          },
        },
      },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }

    return coupon;
  }

  // ─── Update Coupon ──────────────────────────────────────────────────────────
  async updateCoupon(
    adminId: string,
    id: string,
    dto: UpdateCouponDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }

    const updated = await this.prisma.coupon.update({
      where: { id },
      data: {
        description: dto.description !== undefined ? dto.description.trim() : coupon.description,
        maxUses: dto.maxUses !== undefined ? dto.maxUses : coupon.maxUses,
        expiresAt: dto.expiresAt !== undefined ? (dto.expiresAt ? new Date(dto.expiresAt) : null) : coupon.expiresAt,
        isActive: dto.isActive !== undefined ? dto.isActive : coupon.isActive,
      },
      include: {
        course: { select: { id: true, title: true, slug: true } },
      },
    });

    await this.logAction({
      adminId,
      action: 'COUPON_UPDATED',
      targetId: coupon.id,
      targetType: 'Coupon',
      metadata: { dto },
      ipAddress,
      userAgent,
    });

    return updated;
  }

  // ─── Deactivate Coupon ──────────────────────────────────────────────────────
  async deactivateCoupon(
    adminId: string,
    id: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }

    const updated = await this.prisma.coupon.update({
      where: { id },
      data: { isActive: false },
    });

    await this.logAction({
      adminId,
      action: 'COUPON_DEACTIVATED',
      targetId: coupon.id,
      targetType: 'Coupon',
      metadata: { code: coupon.code },
      ipAddress,
      userAgent,
    });

    return { success: true, message: `Coupon ${coupon.code} deactivated successfully` };
  }

  // ─── Validate Coupon (Student / Checkout) ───────────────────────────────────
  async validateCoupon(code: string, courseId: string, amountInPaise: number) {
    const formattedCode = code.trim().toUpperCase();

    const coupon = await this.prisma.coupon.findUnique({
      where: { code: formattedCode },
      include: {
        course: { select: { id: true, title: true } },
      },
    });

    if (!coupon) {
      throw new BadRequestException('Invalid coupon code');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('This coupon is no longer active');
    }

    const now = new Date();
    if (coupon.expiresAt && coupon.expiresAt < now) {
      throw new BadRequestException('This coupon has expired');
    }

    if (coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('This coupon has reached its maximum usage limit');
    }

    if (coupon.courseId) {
      const targetCourse = await this.prisma.course.findFirst({
        where: {
          OR: [{ id: courseId }, { slug: courseId }],
        },
      });
      if (!targetCourse || coupon.courseId !== targetCourse.id) {
        throw new BadRequestException(
          `This coupon is valid only for "${coupon.course?.title || 'a specific course'}"`,
        );
      }
    }

    // Calculate discount
    let discountInPaise = 0;
    if (coupon.discountType === DiscountType.PERCENT) {
      discountInPaise = Math.round((amountInPaise * coupon.discountValue) / 100);
    } else if (coupon.discountType === DiscountType.FLAT) {
      // FLAT discountValue is in paise
      discountInPaise = coupon.discountValue;
    }

    // Ensure discount does not exceed total amount
    discountInPaise = Math.min(discountInPaise, amountInPaise);
    const finalAmountInPaise = Math.max(0, amountInPaise - discountInPaise);

    return {
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountInPaise,
      originalAmountInPaise: amountInPaise,
      finalAmountInPaise,
      courseId: coupon.courseId,
    };
  }

  // ─── Increment Inside Payment Transaction (Critical Rule) ───────────────────
  async applyAndIncrementCouponInTx(
    tx: Prisma.TransactionClient,
    couponCode: string,
    courseId: string,
    amountInPaise: number,
  ) {
    const formattedCode = couponCode.trim().toUpperCase();

    const coupon = await tx.coupon.findUnique({
      where: { code: formattedCode },
    });

    if (!coupon) {
      throw new BadRequestException('Coupon not found during transaction validation');
    }

    if (!coupon.isActive) {
      throw new BadRequestException('Coupon is inactive');
    }

    const now = new Date();
    if (coupon.expiresAt && coupon.expiresAt < now) {
      throw new BadRequestException('Coupon expired during checkout');
    }

    if (coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Coupon limit was reached while processing payment');
    }

    if (coupon.courseId) {
      const targetCourse = await tx.course.findFirst({
        where: {
          OR: [{ id: courseId }, { slug: courseId }],
        },
      });
      if (!targetCourse || coupon.courseId !== targetCourse.id) {
        throw new BadRequestException('Coupon not valid for this course');
      }
    }

    // Calculate discount
    let discountInPaise = 0;
    if (coupon.discountType === DiscountType.PERCENT) {
      discountInPaise = Math.round((amountInPaise * coupon.discountValue) / 100);
    } else {
      discountInPaise = coupon.discountValue;
    }
    discountInPaise = Math.min(discountInPaise, amountInPaise);
    const finalAmountInPaise = Math.max(0, amountInPaise - discountInPaise);

    // Atomically increment usedCount
    const updatedCoupon = await tx.coupon.update({
      where: { id: coupon.id },
      data: {
        usedCount: { increment: 1 },
      },
    });

    return {
      coupon: updatedCoupon,
      discountInPaise,
      finalAmountInPaise,
    };
  }
}
