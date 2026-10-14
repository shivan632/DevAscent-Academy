import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDoubtDto } from './dto/create-doubt.dto';
import { AnswerDoubtDto } from './dto/answer-doubt.dto';
import { Prisma } from '@prisma/client';
import { MailService } from '../../shared/mail.service';

@Injectable()
export class DoubtsService {
  private readonly logger = new Logger(DoubtsService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

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
          targetType: params.targetType || 'Doubt',
          metadata: params.metadata ?? {},
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Failed to write audit log: ${err.message}`);
    }
  }

  // ─── Student: Ask a Doubt / Submit Query ─────────────────────────────────────
  async createDoubt(userId: string, dto: CreateDoubtDto) {
    let resolvedCourseId = dto.courseId || null;

    // If lesson provided, verify lesson and resolve course if needed
    if (dto.lessonId) {
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: dto.lessonId },
        include: { module: true },
      });
      if (!lesson) {
        throw new NotFoundException(`Lesson with ID ${dto.lessonId} not found`);
      }
      if (!resolvedCourseId && lesson.module?.courseId) {
        resolvedCourseId = lesson.module.courseId;
      }
    }

    // If course provided by slug, resolve course id
    if (resolvedCourseId) {
      const course = await this.prisma.course.findFirst({
        where: {
          OR: [{ id: resolvedCourseId }, { slug: resolvedCourseId }],
        },
      });
      if (course) {
        resolvedCourseId = course.id;
      }
    }

    const doubt = await this.prisma.doubt.create({
      data: {
        userId,
        courseId: resolvedCourseId,
        lessonId: dto.lessonId || null,
        question: dto.question.trim(),
        isUrgent: dto.isUrgent || false,
        status: 'PENDING',
      },
      include: {
        course: { select: { id: true, title: true, slug: true } },
        lesson: { select: { id: true, title: true, lessonNumber: true } },
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    return doubt;
  }

  // ─── Student: Get My Queries & Doubts ────────────────────────────────────────
  async getMyDoubts(
    userId: string,
    query: { courseId?: string; status?: string; page?: number; limit?: number },
  ) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.DoubtWhereInput = { userId };

    if (query.status && query.status !== 'all') {
      where.status = query.status.toUpperCase();
    }

    if (query.courseId) {
      const course = await this.prisma.course.findFirst({
        where: { OR: [{ id: query.courseId }, { slug: query.courseId }] },
      });
      if (course) {
        where.courseId = course.id;
      }
    }

    const [doubts, total] = await Promise.all([
      this.prisma.doubt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          course: { select: { id: true, title: true, slug: true } },
          lesson: { select: { id: true, title: true, lessonNumber: true } },
          answeredBy: { select: { id: true, name: true, avatarUrl: true } },
        },
      }),
      this.prisma.doubt.count({ where }),
    ]);

    return {
      doubts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─── Lesson Specific Doubts ──────────────────────────────────────────────────
  async getLessonDoubts(lessonId: string, currentUserId?: string) {
    return this.prisma.doubt.findMany({
      where: {
        lessonId,
        OR: [
          { status: 'ANSWERED' },
          ...(currentUserId ? [{ userId: currentUserId }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        answeredBy: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  // ─── Admin: List All Student Queries ("Quary Desk") ──────────────────────────
  async getAdminDoubts(query: {
    status?: string;
    courseId?: string;
    isUrgent?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.DoubtWhereInput = {};

    if (query.status && query.status !== 'all') {
      where.status = query.status.toUpperCase();
    }

    if (query.isUrgent !== undefined) {
      where.isUrgent = query.isUrgent;
    }

    if (query.courseId) {
      where.courseId = query.courseId;
    }

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { question: { contains: s, mode: 'insensitive' } },
        { answer: { contains: s, mode: 'insensitive' } },
        { user: { name: { contains: s, mode: 'insensitive' } } },
        { user: { email: { contains: s, mode: 'insensitive' } } },
      ];
    }

    const [doubts, total, pendingCount, answeredCount, urgentCount] = await Promise.all([
      this.prisma.doubt.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isUrgent: 'desc' }, { createdAt: 'desc' }],
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, avatarUrl: true } },
          course: { select: { id: true, title: true, slug: true } },
          lesson: { select: { id: true, title: true, lessonNumber: true } },
          answeredBy: { select: { id: true, name: true } },
        },
      }),
      this.prisma.doubt.count({ where }),
      this.prisma.doubt.count({ where: { status: 'PENDING' } }),
      this.prisma.doubt.count({ where: { status: 'ANSWERED' } }),
      this.prisma.doubt.count({ where: { isUrgent: true, status: 'PENDING' } }),
    ]);

    return {
      doubts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalQueries: total,
        pendingQueries: pendingCount,
        answeredQueries: answeredCount,
        urgentQueries: urgentCount,
      },
    };
  }

  // ─── Admin: Answer Student Query ────────────────────────────────────────────
  async answerDoubt(
    adminId: string,
    doubtId: string,
    dto: AnswerDoubtDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const doubt = await this.prisma.doubt.findUnique({
      where: { id: doubtId },
      include: { user: true },
    });

    if (!doubt) {
      throw new NotFoundException(`Doubt query with ID ${doubtId} not found`);
    }

    const updated = await this.prisma.doubt.update({
      where: { id: doubtId },
      data: {
        answer: dto.answer.trim(),
        status: 'ANSWERED',
        answeredById: adminId,
        answeredAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
        lesson: { select: { id: true, title: true } },
        answeredBy: { select: { id: true, name: true } },
      },
    });

    await this.logAction({
      adminId,
      action: 'DOUBT_ANSWERED',
      targetId: doubt.id,
      targetType: 'Doubt',
      metadata: {
        studentId: doubt.userId,
        studentEmail: doubt.user.email,
        questionSnippet: doubt.question.substring(0, 80),
      },
      ipAddress,
      userAgent,
    });

    // Send asynchronous branded email notification to student
    if (doubt.user?.email) {
      this.mailService.sendDoubtAnsweredEmail(
        doubt.user.email,
        doubt.user.name || 'Student',
        doubt.question,
        dto.answer.trim(),
      ).catch(() => {});
    }

    // Trigger in-app Notification for the student
    await this.prisma.notification.create({
      data: {
        userId: doubt.userId,
        targetRole: 'STUDENT',
        type: 'INFO',
        title: 'Your Doubt Has Been Answered!',
        message: `Instructor replied: "${dto.answer.trim().slice(0, 100)}" to your question "${doubt.question.slice(0, 60)}"`,
      },
    }).catch(() => {});

    return updated;
  }

  // ─── Admin: Delete Doubt ────────────────────────────────────────────────────
  async deleteDoubt(
    adminId: string,
    doubtId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const doubt = await this.prisma.doubt.findUnique({ where: { id: doubtId } });
    if (!doubt) {
      throw new NotFoundException(`Doubt with ID ${doubtId} not found`);
    }

    await this.prisma.doubt.delete({ where: { id: doubtId } });

    await this.logAction({
      adminId,
      action: 'DOUBT_DELETED',
      targetId: doubtId,
      targetType: 'Doubt',
      metadata: { questionSnippet: doubt.question.substring(0, 80) },
      ipAddress,
      userAgent,
    });

    return { success: true, message: 'Doubt deleted successfully' };
  }
}
