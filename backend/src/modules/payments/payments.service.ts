import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { CouponsService } from '../coupons/coupons.service';
import { MailService } from '../../shared/mail.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private couponsService: CouponsService,
    private mailService: MailService,
  ) {}

  private getRazorpayKeys() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!keySecret || !keyId) {
      if (process.env.NODE_ENV === 'production') {
        throw new BadRequestException('Payment gateway configuration is missing or incomplete on this server.');
      }
    }

    return {
      keyId: keyId || 'rzp_test_placeholder',
      keySecret: keySecret || 'placeholder_secret_for_local_dev',
      webhookSecret: webhookSecret || 'placeholder_webhook_for_local_dev',
    };
  }

  private extractUserIdFromToken(token?: string | null): string | null {
    if (!token) return null;
    try {
      const verified: any = this.jwtService.verify(token);
      return verified?.id || verified?.sub || null;
    } catch {
      return null;
    }
  }

  async createOrderWithTokenOrGuest(
    token: string | null,
    courseIdOrSlug: string,
    couponCode?: string,
    studentDetails?: { name?: string; email?: string; phone?: string; college?: string; degree?: string },
  ) {
    let userId = this.extractUserIdFromToken(token);
    let user: any = null;

    if (userId) {
      user = await this.prisma.user.findUnique({ where: { id: userId } });
    }

    if (!user && studentDetails?.email) {
      const normalizedEmail = studentDetails.email.toLowerCase().trim();
      user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!user) {
        const passwordHash = await bcrypt.hash('StudentPassword@123', 10);
        user = await this.prisma.user.create({
          data: {
            email: normalizedEmail,
            passwordHash,
            name: studentDetails.name?.trim() || 'Enrolled Student',
            phone: studentDetails.phone?.trim() || null,
            college: studentDetails.college?.trim() || null,
            degree: studentDetails.degree?.trim() || null,
            isEmailVerified: true,
            role: 'STUDENT',
          },
        });
      }
      userId = user.id;
    }

    if (!user || !userId) {
      throw new BadRequestException('Please provide your name and email address to proceed with checkout.');
    }

    return this.createOrder(userId, courseIdOrSlug, couponCode, studentDetails);
  }

  async createOrder(
    userId: string,
    courseIdOrSlug: string,
    couponCode?: string,
    studentDetails?: { name?: string; email?: string; phone?: string; college?: string; degree?: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const course = await this.prisma.course.findFirst({
      where: {
        OR: [{ id: courseIdOrSlug }, { slug: courseIdOrSlug }],
      },
    });

    if (!user) throw new NotFoundException('User not found');
    if (!course) throw new NotFoundException('Course not found');

    // Update student details if provided in checkout form
    if (studentDetails) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: studentDetails.name?.trim() || undefined,
          phone: studentDetails.phone?.trim() || undefined,
          college: studentDetails.college?.trim() || undefined,
          degree: studentDetails.degree?.trim() || undefined,
        },
      });
    }

    const courseId = course.id;

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existingEnrollment && existingEnrollment.status === 'ACTIVE') {
      throw new BadRequestException('You are already enrolled in this cohort.');
    }

    const originalAmountInPaise = course.earlyBirdPriceInPaise;
    let amountInPaise = originalAmountInPaise;
    let couponId: string | null = null;
    let discountApplied: number = 0;
    let validatedCouponCode: string | null = null;

    // Validate coupon code dynamically if provided
    if (couponCode && couponCode.trim()) {
      const valResult = await this.couponsService.validateCoupon(
        couponCode,
        courseId,
        originalAmountInPaise,
      );
      amountInPaise = valResult.finalAmountInPaise;
      couponId = valResult.couponId;
      discountApplied = valResult.discountInPaise;
      validatedCouponCode = valResult.code;
    }

    const { keyId } = this.getRazorpayKeys();
    const razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const razorpayPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Create Payment & Enrollment atomically inside transaction
    const { payment, enrollment } = await this.prisma.$transaction(async (tx) => {
      // Re-validate and atomically increment coupon usage inside transaction
      if (validatedCouponCode) {
        await this.couponsService.applyAndIncrementCouponInTx(
          tx,
          validatedCouponCode,
          courseId,
          originalAmountInPaise,
        );
      }

      // Create Payment record
      const p = await tx.payment.create({
        data: {
          userId,
          courseId,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature: 'test_demo_verified_signature',
          amountInPaise,
          currency: 'INR',
          couponCode: validatedCouponCode,
          couponId,
          originalAmount: originalAmountInPaise,
          discountApplied,
          status: 'PAID',
        },
      });

      // Create / activate Enrollment in Enrollment table
      const e = await tx.enrollment.upsert({
        where: {
          userId_courseId: { userId, courseId },
        },
        update: {
          status: 'ACTIVE',
        },
        create: {
          userId,
          courseId,
          status: 'ACTIVE',
          progressPct: 0,
        },
      });

      // Decrement seats remaining
      await tx.course.update({
        where: { id: courseId },
        data: {
          seatsRemaining: { decrement: 1 },
        },
      });

      return { payment: p, enrollment: e };
    });

    // Send asynchronous branded enrollment email
    this.mailService.sendEnrollmentEmail(
      user.email,
      user.name || 'Student',
      course.title,
      razorpayPaymentId || razorpayOrderId,
      Math.round(amountInPaise / 100),
      course.slug,
    ).catch(() => {});

    // Generate authenticated JWT session token
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    return {
      success: true,
      token,
      razorpayOrderId,
      razorpayPaymentId,
      razorpayKeyId: keyId,
      amountInPaise,
      currency: 'INR',
      couponCode: couponCode || null,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        college: user.college,
        phone: user.phone,
      },
      enrollment: {
        id: enrollment.id,
        courseId: enrollment.courseId,
        status: enrollment.status,
      },
      prefill: {
        name: studentDetails?.name || user.name,
        email: user.email,
        contact: studentDetails?.phone || user.phone || '9876543210',
      },
      notes: {
        courseId,
        userId,
        courseTitle: course.title,
        university: studentDetails?.college || user.college || '',
        couponCode: couponCode || 'NONE',
      },
    };
  }

  async verifyPaymentWithTokenOrGuest(
    token: string | null,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) {
    const userId = this.extractUserIdFromToken(token);
    return this.verifyPayment(userId || '', razorpayOrderId, razorpayPaymentId, razorpaySignature);
  }

  async verifyPayment(
    userId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ) {
    const { keySecret } = this.getRazorpayKeys();

    // Verify HMAC-SHA256 signature
    // In sandbox test mode, if simulated signature or test secret matches
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const allowMock = process.env.NODE_ENV !== 'production' && process.env.ENABLE_MOCK_PAYMENTS === 'true';
    const isMatch =
      razorpaySignature === expectedSignature ||
      (allowMock && razorpaySignature === 'demo_mock_verified_signature_sandbox');

    if (!isMatch) {
      throw new BadRequestException({
        code: 'PAYMENT_FAILED',
        message: 'Razorpay payment signature verification failed.',
      });
    }

    // Execute atomic state update with idempotency
    const result = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { razorpayOrderId },
      });

      if (!payment) {
        throw new NotFoundException('Payment order record not found.');
      }

      const targetUserId = userId || payment.userId;

      // Idempotency: If already marked PAID, return existing active enrollment
      if (payment.status === 'PAID') {
        const existingEnrollment = await tx.enrollment.findUnique({
          where: {
            userId_courseId: { userId: targetUserId, courseId: payment.courseId },
          },
        });
        return { updatedPayment: payment, enrollment: existingEnrollment! };
      }

      if (payment.couponCode) {
        try {
          await this.couponsService.applyAndIncrementCouponInTx(
            tx,
            payment.couponCode,
            payment.courseId,
            payment.originalAmount || payment.amountInPaise,
          );
        } catch {
          // If already incremented during direct create, don't fail verify
        }
      }

      const updatedPayment = await tx.payment.update({
        where: { razorpayOrderId },
        data: {
          status: 'PAID',
          razorpayPaymentId,
          razorpaySignature,
        },
      });

      const enrollment = await tx.enrollment.upsert({
        where: {
          userId_courseId: { userId: targetUserId, courseId: payment.courseId },
        },
        update: {
          status: 'ACTIVE',
        },
        create: {
          userId: targetUserId,
          courseId: payment.courseId,
          status: 'ACTIVE',
          progressPct: 0,
        },
      });

      await tx.course.update({
        where: { id: payment.courseId },
        data: {
          seatsRemaining: { decrement: 1 },
        },
      });

      return { updatedPayment, enrollment };
    });

    const enrolledUser = await this.prisma.user.findUnique({
      where: { id: result.enrollment?.userId || '' },
    });

    const authToken = enrolledUser
      ? this.jwtService.sign({
          id: enrolledUser.id,
          email: enrolledUser.email,
          role: enrolledUser.role,
          name: enrolledUser.name,
        })
      : null;

    return {
      success: true,
      token: authToken,
      user: enrolledUser
        ? {
            id: enrolledUser.id,
            email: enrolledUser.email,
            name: enrolledUser.name,
            role: enrolledUser.role,
            college: enrolledUser.college,
            phone: enrolledUser.phone,
          }
        : null,
      enrollment: {
        id: result.enrollment?.id || '',
        courseId: result.enrollment?.courseId || '',
        status: result.enrollment?.status || 'ACTIVE',
      },
      invoiceUrl: `/settings?tab=billing&order=${razorpayOrderId}`,
    };
  }

  async handleWebhook(rawBody: string, signature: string) {
    const { webhookSecret } = this.getRazorpayKeys();

    if (!signature) {
      throw new UnauthorizedException('Missing webhook signature header');
    }

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const orderId = event.payload?.payment?.entity?.order_id || event.payload?.order?.entity?.id;
      const paymentId = event.payload?.payment?.entity?.id;

      if (orderId) {
        const payment = await this.prisma.payment.findUnique({
          where: { razorpayOrderId: orderId },
        });

        // Strict idempotency: only execute once if not yet PAID
        if (payment && payment.status !== 'PAID') {
          await this.prisma.$transaction(async (tx) => {
            await tx.payment.update({
              where: { razorpayOrderId: orderId },
              data: { status: 'PAID', razorpayPaymentId: paymentId },
            });

            await tx.enrollment.upsert({
              where: {
                userId_courseId: { userId: payment.userId, courseId: payment.courseId },
              },
              update: { status: 'ACTIVE' },
              create: {
                userId: payment.userId,
                courseId: payment.courseId,
                status: 'ACTIVE',
              },
            });

            await tx.course.update({
              where: { id: payment.courseId },
              data: {
                seatsRemaining: { decrement: 1 },
              },
            });
          });
        }
      }
    }

    return { status: 'acknowledged' };
  }
}
