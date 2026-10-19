import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../shared/cache.service';

function validateDriveUrl(url: string | null | undefined, fieldName = 'Lesson / PDF URL'): string | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();

  // If it's a Google Drive link, normalize to /preview format
  const GOOGLE_DRIVE_REGEX = /^https:\/\/(?:drive|docs)\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = trimmed.match(GOOGLE_DRIVE_REGEX);
  if (match) {
    const fileId = match[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  // Accept any valid HTTP or HTTPS URL (e.g. Cloudflare Pages, custom web notes, PDFs)
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new BadRequestException(
        `Please provide a valid HTTP or HTTPS link for ${fieldName}.`
      );
    }
    return trimmed;
  } catch (err: any) {
    if (err instanceof BadRequestException) throw err;
    throw new BadRequestException(
      `Please provide a valid web URL for ${fieldName}. Received: ${trimmed}`
    );
  }
}
 
@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}

  private async purgeCourseCache() {
    try {
      await this.cacheService.delPrefix('course_structure');
      await this.cacheService.delPrefix('findAll');
    } catch (e) {}
  }

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
    return this.prisma.auditLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        targetId: params.targetId,
        targetType: params.targetType,
        metadata: params.metadata ?? {},
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  }

  // ─── Overview (KPI Cards) ───────────────────────────────────────────────────
  async getOverview() {
    const [
      totalStudents,
      activeStudents,
      suspendedStudents,
      totalEnrollments,
      paidPayments,
      pendingRefunds,
      totalSubmissions,
      pendingSubmissions,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'STUDENT' } }),
      this.prisma.user.count({ where: { role: 'STUDENT', status: 'ACTIVE' } }),
      this.prisma.user.count({ where: { role: 'STUDENT', status: 'SUSPENDED' } }),
      this.prisma.enrollment.count(),
      this.prisma.payment.findMany({ where: { status: 'PAID' } }),
      this.prisma.refund.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.completionSubmission.count(),
      this.prisma.completionSubmission.count({ where: { status: 'PENDING' } }),
    ]);

    const totalRevenueInPaise = paidPayments.reduce(
      (acc, curr) => acc + curr.amountInPaise,
      0,
    );

    return {
      totalStudents,
      activeStudents,
      suspendedStudents,
      totalEnrollments,
      totalRevenueInRupees: Math.round(totalRevenueInPaise / 100),
      pendingRefunds,
      totalSubmissions,
      pendingSubmissions,
    };
  }

  // ─── Badge Counts (for sidebar) ─────────────────────────────────────────────
  async getBadgeCounts() {
    const [pendingRefunds, pendingSubmissions, pendingQueries] = await Promise.all([
      this.prisma.refund.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.completionSubmission.count({ where: { status: 'PENDING' } }),
      this.prisma.doubt.count({ where: { status: 'PENDING' } }),
    ]);
    return { pendingRefunds, pendingSubmissions, pendingQueries };
  }

  // ─── Students (Paginated) ───────────────────────────────────────────────────
  async getStudents(
    page = 1,
    limit = 20,
    filters: {
      search?: string;
      degree?: string;
      status?: string;
      emailVerified?: string;
      courseId?: string;
    } = {},
  ) {
    const skip = (page - 1) * limit;
    const where: any = { role: 'STUDENT' };

    if (filters.status && filters.status !== 'ALL' && filters.status !== 'undefined' && filters.status !== 'null') {
      where.status = filters.status;
    }
    if (filters.degree && filters.degree !== 'ALL' && filters.degree !== 'undefined' && filters.degree !== 'null') {
      where.degree = filters.degree;
    }
    if (filters.emailVerified && filters.emailVerified !== 'ALL' && filters.emailVerified !== 'undefined' && filters.emailVerified !== 'null') {
      where.isEmailVerified = filters.emailVerified === 'true' || filters.emailVerified === 'VERIFIED';
    }
    if (filters.courseId && filters.courseId !== 'ALL' && filters.courseId !== 'undefined' && filters.courseId !== 'null') {
      where.enrollments = { some: { courseId: filters.courseId } };
    }
    if (filters.search && filters.search.trim() && filters.search !== 'undefined') {
      where.OR = [
        { name: { contains: filters.search.trim(), mode: 'insensitive' } },
        { email: { contains: filters.search.trim(), mode: 'insensitive' } },
      ];
    }

    const [total, students] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          degree: true,
          college: true,
          city: true,
          status: true,
          isEmailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          adminNote: true,
          enrollments: {
            select: {
              id: true,
              courseId: true,
              progressPct: true,
              status: true,
              course: { select: { id: true, title: true, slug: true } },
            },
          },
          payments: {
            where: { status: 'PAID' },
            select: { amountInPaise: true },
          },
          certificates: { select: { id: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: students.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        degree: s.degree,
        college: s.college,
        collegeName: s.college,
        city: s.city,
        status: s.status,
        isEmailVerified: s.isEmailVerified,
        lastLoginAt: s.lastLoginAt,
        joinedAt: s.createdAt,
        adminNote: s.adminNote,
        enrollmentCount: s.enrollments.length,
        certificateCount: s.certificates.length,
        totalSpentRupees: Math.round(
          s.payments.reduce((acc, curr) => acc + curr.amountInPaise, 0) / 100,
        ),
        enrollments: s.enrollments,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── Enrollments (Paginated Admin View) ─────────────────────────────────────
  async getEnrollments(
    page = 1,
    limit = 25,
    filters: {
      search?: string;
      courseId?: string;
      status?: string;
    } = {},
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.courseId && filters.courseId !== 'ALL' && filters.courseId !== 'undefined') {
      where.courseId = filters.courseId;
    }
    if (filters.status && filters.status !== 'ALL' && filters.status !== 'undefined') {
      where.status = filters.status;
    }
    if (filters.search && filters.search.trim() && filters.search !== 'undefined') {
      where.user = {
        OR: [
          { name: { contains: filters.search.trim(), mode: 'insensitive' } },
          { email: { contains: filters.search.trim(), mode: 'insensitive' } },
        ],
      };
    }

    const [total, enrollments] = await Promise.all([
      this.prisma.enrollment.count({ where }),
      this.prisma.enrollment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              degree: true,
              status: true,
              isEmailVerified: true,
              avatarUrl: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              cohortNumber: true,
              type: true,
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    // Attach payment info for each enrollment
    const enrollmentIds = enrollments.map((e) => e.userId + '_' + e.courseId);
    const payments = await this.prisma.payment.findMany({
      where: {
        OR: enrollments.map((e) => ({ userId: e.userId, courseId: e.courseId, status: 'PAID' })),
      },
      select: { userId: true, courseId: true, amountInPaise: true, createdAt: true, razorpayPaymentId: true },
    });

    const paymentMap = new Map<string, any>();
    for (const p of payments) {
      paymentMap.set(`${p.userId}_${p.courseId}`, p);
    }

    return {
      data: enrollments.map((e) => {
        const payment = paymentMap.get(`${e.userId}_${e.courseId}`);
        return {
          id: e.id,
          enrolledAt: e.enrolledAt,
          status: e.status,
          progressPct: e.progressPct,
          student: e.user,
          course: e.course,
          payment: payment
            ? {
                amountRupees: Math.round(payment.amountInPaise / 100),
                paidAt: payment.createdAt,
                razorpayPaymentId: payment.razorpayPaymentId,
              }
            : null,
        };
      }),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ─── Payments (Paginated & Real DB) ─────────────────────────────────────────
  async getPayments(
    page = 1,
    limit = 20,
    filters: {
      search?: string;
      status?: string;
      courseId?: string;
      cohort?: string;
      emailVerified?: string;
    } = {},
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.status && filters.status !== 'ALL' && filters.status !== 'undefined' && filters.status !== 'null') {
      const dbStatus = filters.status === 'SUCCESS' ? 'PAID' : filters.status;
      where.status = dbStatus;
    }
    if (filters.courseId && filters.courseId !== 'ALL' && filters.courseId !== 'undefined' && filters.courseId !== 'null') {
      where.courseId = filters.courseId;
    }
    if (filters.emailVerified && filters.emailVerified !== 'ALL' && filters.emailVerified !== 'undefined' && filters.emailVerified !== 'null') {
      where.user = {
        ...(where.user || {}),
        isEmailVerified: filters.emailVerified === 'VERIFIED' || filters.emailVerified === 'true',
      };
    }
    if (filters.search && filters.search.trim() && filters.search !== 'undefined') {
      where.OR = [
        { razorpayOrderId: { contains: filters.search.trim(), mode: 'insensitive' } },
        { razorpayPaymentId: { contains: filters.search.trim(), mode: 'insensitive' } },
        { user: { name: { contains: filters.search.trim(), mode: 'insensitive' } } },
        { user: { email: { contains: filters.search.trim(), mode: 'insensitive' } } },
      ];
    }

    const [total, payments, paidPayments, allPaymentsCount, verifiedStudentsCount] = await Promise.all([
      this.prisma.payment.count({ where }),
      this.prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              isEmailVerified: true,
              phone: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              cohortNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.payment.findMany({
        where: { status: { in: ['PAID', 'SUCCESS', 'captured', 'PENDING'] } },
        select: { amountInPaise: true, status: true },
      }),
      this.prisma.payment.count(),
      this.prisma.payment.count({
        where: { user: { isEmailVerified: true } },
      }),
    ]);

    const paidRevenue = Math.round(
      paidPayments
        .filter(p => p.status === 'PAID' || p.status === 'SUCCESS' || p.status === 'captured')
        .reduce((acc, p) => acc + p.amountInPaise, 0) / 100,
    );
    const pendingRevenue = Math.round(
      paidPayments
        .filter(p => p.status === 'PENDING')
        .reduce((acc, p) => acc + p.amountInPaise, 0) / 100,
    );
    const totalRevenueInRupees = paidRevenue + pendingRevenue;

    const successCount = await this.prisma.payment.count({ where: { status: { in: ['PAID', 'SUCCESS', 'captured'] } } });
    const pendingCount = await this.prisma.payment.count({ where: { status: 'PENDING' } });

    return {
      data: payments.map((p) => ({
        id: p.id,
        studentId: p.user?.id,
        studentName: p.user?.name || 'Student',
        studentEmail: p.user?.email || '',
        studentPhone: p.user?.phone,
        emailVerified: p.user?.isEmailVerified ?? false,
        courseId: p.course?.id,
        courseName: p.course?.title || 'Course',
        cohort: `Cohort ${p.course?.cohortNumber || 4}`,
        amount: Math.round(p.amountInPaise / 100),
        amountInPaise: p.amountInPaise,
        status: p.status === 'PAID' ? 'SUCCESS' : p.status,
        method: p.razorpayPaymentId ? 'Razorpay' : 'Pending Gateway',
        transactionId: p.razorpayPaymentId || p.razorpayOrderId,
        paidAt: p.createdAt.toISOString(),
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalRevenue: totalRevenueInRupees,
        paidRevenue,
        pendingRevenue,
        successCount,
        pendingCount,
        verifiedCount: verifiedStudentsCount,
        totalCount: allPaymentsCount,
      },
    };
  }

  // ─── Single Student Detail ───────────────────────────────────────────────────
  async getStudentDetail(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          include: {
            course: { select: { id: true, title: true, slug: true, cohortNumber: true } },
          },
          orderBy: { enrolledAt: 'desc' },
        },
        certificates: {
          include: { course: { select: { title: true, slug: true } } },
        },
        payments: {
          include: { course: { select: { title: true } } },
          orderBy: { createdAt: 'desc' },
        },
        refunds: {
          orderBy: { createdAt: 'desc' },
        },
        completionSubmissions: {
          include: { course: { select: { title: true } } },
        },
        quizSubmissions: {
          include: {
            quiz: { select: { id: true, title: true, lessonId: true, moduleId: true } },
          },
          orderBy: { submittedAt: 'desc' },
        },
        aiVideoProgress: {
          include: { aiVideo: { select: { id: true, title: true, order: true } } },
        },
      },
    });
    if (!student) throw new NotFoundException('Student not found');

    // Cast to any so we can spread and add computed fields without TS complaints
    const s = student as any;
    const { passwordHash, ...safeStudent } = s;
    return {
      ...safeStudent,
      enrollmentCount: s.enrollments?.length ?? 0,
      certificateCount: s.certificates?.length ?? 0,
      totalSpentRupees: Math.round(
        (s.payments ?? []).filter((p: any) => p.status === 'PAID').reduce((acc: number, p: any) => acc + p.amountInPaise, 0) / 100,
      ),
      watchedVideosCount: (s.aiVideoProgress ?? []).filter((p: any) => p.watched).length,
    };
  }

  // ─── Suspend / Restore Student ───────────────────────────────────────────────
  async suspendStudent(
    adminId: string,
    studentId: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');
    if (student.role === 'ADMIN') throw new ForbiddenException('Cannot suspend another admin');

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: studentId },
        data: { status: 'SUSPENDED', suspendedAt: new Date(), adminNote: reason },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'STUDENT_SUSPENDED',
          targetId: studentId,
          targetType: 'User',
          metadata: { reason, studentName: student.name, studentEmail: student.email },
          ipAddress,
          userAgent,
        },
      }),
    ]);

    return { success: true, message: `Student ${student.name} suspended` };
  }

  async restoreStudent(
    adminId: string,
    studentId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: studentId },
        data: { status: 'ACTIVE', suspendedAt: null },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'STUDENT_RESTORED',
          targetId: studentId,
          targetType: 'User',
          metadata: { studentName: student.name, studentEmail: student.email },
          ipAddress,
          userAgent,
        },
      }),
    ]);

    return { success: true, message: `Student ${student.name} restored` };
  }

  async verifyStudentEmail(
    adminId: string,
    studentId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: studentId },
        data: { isEmailVerified: true },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'STUDENT_EMAIL_VERIFIED',
          targetId: studentId,
          targetType: 'User',
          metadata: { studentName: student.name, studentEmail: student.email },
          ipAddress,
          userAgent,
        },
      }),
    ]);

    return { success: true, message: `Email for ${student.name} marked as verified.` };
  }

  async enrollStudentManual(
    adminId: string,
    studentId: string,
    courseId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const [student, course] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: studentId } }),
      this.prisma.course.findUnique({ where: { id: courseId } }),
    ]);
    if (!student) throw new NotFoundException('Student not found');
    if (!course) throw new NotFoundException('Course not found');

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: studentId, courseId } },
    });
    if (existing) {
      throw new ForbiddenException(`Student is already enrolled in ${course.title}`);
    }

    const [enrollment] = await this.prisma.$transaction([
      this.prisma.enrollment.create({
        data: {
          userId: studentId,
          courseId,
          progressPct: 0,
          status: 'ACTIVE',
        },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'STUDENT_MANUALLY_ENROLLED',
          targetId: studentId,
          targetType: 'User',
          metadata: { studentName: student.name, studentEmail: student.email, courseTitle: course.title },
          ipAddress,
          userAgent,
        },
      }),
    ]);

    return { success: true, enrollment, message: `Enrolled ${student.name} into ${course.title}` };
  }

  async updateStudentNote(
    adminId: string,
    studentId: string,
    note: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const student = await this.prisma.user.findUnique({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: studentId },
        data: { adminNote: note },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'STUDENT_NOTE_UPDATED',
          targetId: studentId,
          targetType: 'User',
          metadata: { studentName: student.name, notePreview: note.slice(0, 50) },
          ipAddress,
          userAgent,
        },
      }),
    ]);

    return { success: true, message: 'Note updated successfully.' };
  }

  // ─── Refunds ────────────────────────────────────────────────────────────────
  async getRefunds(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    const refunds = await this.prisma.refund.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        payment: {
          select: {
            razorpayOrderId: true,
            razorpayPaymentId: true,
            amountInPaise: true,
            course: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { refunds };
  }

  async approveRefund(
    adminId: string,
    refundId: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const refund = await this.prisma.refund.findUnique({
      where: { id: refundId },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!refund) throw new NotFoundException('Refund not found');

    const [updated] = await this.prisma.$transaction([
      this.prisma.refund.update({
        where: { id: refundId },
        data: { status: 'APPROVED', processedAt: new Date() },
      }),
      this.prisma.payment.update({
        where: { id: refund.paymentId },
        data: { status: 'REFUNDED' },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'REFUND_APPROVED',
          targetId: refundId,
          targetType: 'Refund',
          metadata: {
            studentName: refund.user.name,
            studentEmail: refund.user.email,
            amountRupees: Math.round(refund.amountInPaise / 100),
          },
          ipAddress,
          userAgent,
        },
      }),
    ]);

    return { success: true, refund: updated };
  }

  async rejectRefund(
    adminId: string,
    refundId: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const refund = await this.prisma.refund.findUnique({
      where: { id: refundId },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!refund) throw new NotFoundException('Refund not found');

    const [updated] = await this.prisma.$transaction([
      this.prisma.refund.update({
        where: { id: refundId },
        data: { status: 'REJECTED', rejectionReason: reason, processedAt: new Date() },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'REFUND_REJECTED',
          targetId: refundId,
          targetType: 'Refund',
          metadata: {
            reason,
            studentName: refund.user.name,
            studentEmail: refund.user.email,
          },
          ipAddress,
          userAgent,
        },
      }),
    ]);

    return { success: true, refund: updated };
  }

  // ─── Submissions ─────────────────────────────────────────────────────────────
  async getSubmissions(status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [total, submissions] = await Promise.all([
      this.prisma.completionSubmission.count({ where }),
      this.prisma.completionSubmission.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true, slug: true } },
        },
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      submissions,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async approveSubmission(
    adminId: string,
    submissionId: string,
    adminNote?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const submission = await this.prisma.completionSubmission.findUnique({
      where: { id: submissionId },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!submission) throw new NotFoundException('Submission not found');

    await this.prisma.$transaction([
      this.prisma.completionSubmission.update({
        where: { id: submissionId },
        data: { status: 'APPROVED', adminNote, reviewedAt: new Date() },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'SUBMISSION_APPROVED',
          targetId: submissionId,
          targetType: 'Submission',
          metadata: {
            studentName: submission.user.name,
            studentEmail: submission.user.email,
            projectName: submission.projectName,
          },
          ipAddress,
          userAgent,
        },
      }),
    ]);

    return { success: true };
  }

  async rejectSubmission(
    adminId: string,
    submissionId: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const submission = await this.prisma.completionSubmission.findUnique({
      where: { id: submissionId },
      include: { user: { select: { name: true, email: true } } },
    });
    if (!submission) throw new NotFoundException('Submission not found');

    await this.prisma.$transaction([
      this.prisma.completionSubmission.update({
        where: { id: submissionId },
        data: { status: 'REJECTED', adminNote: reason, reviewedAt: new Date() },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'SUBMISSION_REJECTED',
          targetId: submissionId,
          targetType: 'Submission',
          metadata: { reason, studentName: submission.user.name },
          ipAddress,
          userAgent,
        },
      }),
    ]);

    return { success: true };
  }

  async bulkApproveSubmissions(adminId: string, submissionIds: string[]) {
    await this.prisma.$transaction([
      this.prisma.completionSubmission.updateMany({
        where: { id: { in: submissionIds }, status: 'PENDING' },
        data: { status: 'APPROVED', reviewedAt: new Date() },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'SUBMISSIONS_BULK_APPROVED',
          targetType: 'Submission',
          metadata: { submissionIds, count: submissionIds.length },
        },
      }),
    ]);
    return { success: true, count: submissionIds.length };
  }

  // ─── Course Stats ─────────────────────────────────────────────────────────────
  async getCourseStats() {
    const courses = await this.prisma.course.findMany({
      include: {
        enrollments: { select: { status: true, progressPct: true } },
        certificates: { select: { id: true } },
        payments: { where: { status: 'PAID' }, select: { amountInPaise: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      courses: courses.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        type: c.type,
        isPublished: c.isPublished,
        enrollmentCount: c.enrollments.length,
        certificateCount: c.certificates.length,
        avgProgress:
          c.enrollments.length > 0
            ? Math.round(
                c.enrollments.reduce((a, e) => a + e.progressPct, 0) /
                  c.enrollments.length,
              )
            : 0,
        revenueRupees: Math.round(
          c.payments.reduce((a, p) => a + p.amountInPaise, 0) / 100,
        ),
      })),
    };
  }

  // ─── Analytics ───────────────────────────────────────────────────────────────
  async getAnalytics() {
    // Daily signups for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSignups = await this.prisma.user.findMany({
      where: { role: 'STUDENT', createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const recentPayments = await this.prisma.payment.findMany({
      where: { status: 'PAID', createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, amountInPaise: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const signupsByDay: Record<string, number> = {};
    const revenueByDay: Record<string, number> = {};

    for (const u of recentSignups) {
      const day = u.createdAt.toISOString().split('T')[0];
      signupsByDay[day] = (signupsByDay[day] || 0) + 1;
    }
    for (const p of recentPayments) {
      const day = p.createdAt.toISOString().split('T')[0];
      revenueByDay[day] = (revenueByDay[day] || 0) + p.amountInPaise;
    }

    return { signupsByDay, revenueByDay };
  }

  // ─── Audit Log ───────────────────────────────────────────────────────────────
  async getAuditLog(
    page = 1,
    limit = 30,
    filters: { action?: string; adminId?: string } = {},
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (filters.action) where.action = filters.action;
    if (filters.adminId) where.adminId = filters.adminId;

    const [total, logs] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        include: { admin: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      logs,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── CSV Export ──────────────────────────────────────────────────────────────
  async exportStudentsCSV(): Promise<string> {
    const students = await this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        name: true,
        email: true,
        degree: true,
        college: true,
        city: true,
        status: true,
        createdAt: true,
        enrollments: { select: { id: true } },
        payments: { where: { status: 'PAID' }, select: { amountInPaise: true } },
        certificates: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const header =
      'Name,Email,Degree,College,City,Status,Enrollments,Certificates,Total Spent (₹),Joined\n';
    const rows = students
      .map((s) => {
        const totalRs = Math.round(
          s.payments.reduce((a, p) => a + p.amountInPaise, 0) / 100,
        );
        return `"${s.name}","${s.email}","${s.degree || ''}","${s.college || ''}","${s.city || ''}","${s.status}","${s.enrollments.length}","${s.certificates.length}","${totalRs}","${s.createdAt.toISOString()}"`;
      })
      .join('\n');

    return header + rows;
  }

  async exportRevenueCSV(): Promise<string> {
    const payments = await this.prisma.payment.findMany({
      where: { status: 'PAID' },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const header = 'Date,Student Name,Email,Course,Amount (₹),Payment ID\n';
    const rows = payments
      .map(
        (p) =>
          `"${p.createdAt.toISOString().split('T')[0]}","${p.user.name}","${p.user.email}","${p.course.title}","${Math.round(p.amountInPaise / 100)}","${p.razorpayPaymentId || ''}"`,
      )
      .join('\n');

    return header + rows;
  }

  // ─── Role Management ─────────────────────────────────────────────────────────
  async updateUserRole(
    adminId: string,
    targetUserId: string,
    newRole: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    if (!['STUDENT', 'ADMIN', 'INSTRUCTOR'].includes(newRole)) {
      throw new ForbiddenException('Invalid role');
    }

    const target = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!target) throw new NotFoundException('User not found');

    const oldRole = target.role;
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: targetUserId },
        data: { role: newRole },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'ROLE_CHANGED',
          targetId: targetUserId,
          targetType: 'User',
          metadata: { oldRole, newRole, targetName: target.name },
          ipAddress,
          userAgent,
        },
      }),
    ]);

    return { success: true };
  }

  // ─── Curriculum & Course Content Management ──────────────────────────────────
  async getCourseCurriculum(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                quiz: {
                  include: {
                    questions: true,
                  },
                },
                doubts: {
                  include: {
                    user: { select: { id: true, name: true, avatarUrl: true } },
                  },
                  orderBy: { createdAt: 'desc' },
                },
              },
              orderBy: { lessonNumber: 'asc' },
            },
            quiz: {
              include: {
                questions: true,
              },
            },
          },
          orderBy: { moduleNumber: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with slug "${slug}" not found`);
    }

    // Parse metadata safely
    const enrichedModules = course.modules.map((m) => ({
      ...m,
      lessons: m.lessons.map((l) => ({
        ...l,
        quiz: l.quiz
          ? {
              ...l.quiz,
              questions: l.quiz.questions.map((q) => {
                let options: string[] = [];
                try {
                  options = JSON.parse(q.optionsJson || '[]');
                } catch (e) {}
                return { ...q, options: q.options && q.options.length > 0 ? q.options : options };
              }),
            }
          : null,
      })),
    }));

    return {
      course: {
        ...course,
        modules: enrichedModules,
      },
    };
  }

  async createModule(slug: string, dto: { title: string; description?: string; moduleNumber?: number }) {
    const course = await this.prisma.course.findUnique({ where: { slug } });
    if (!course) throw new NotFoundException('Course not found');

    const nextModuleNumber =
      dto.moduleNumber ||
      ((await this.prisma.module.count({ where: { courseId: course.id } })) + 1);

    const module = await this.prisma.module.create({
      data: {
        courseId: course.id,
        title: dto.title,
        description: dto.description || '',
        moduleNumber: nextModuleNumber,
      },
      include: {
        lessons: true,
      },
    });

    await this.purgeCourseCache();
    return { success: true, module };
  }

  async updateModule(moduleId: string, dto: { title?: string; description?: string; moduleNumber?: number }) {
    const module = await this.prisma.module.update({
      where: { id: moduleId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.moduleNumber !== undefined && { moduleNumber: dto.moduleNumber }),
      },
      include: {
        lessons: true,
      },
    });

    return { success: true, module };
  }

  async deleteModule(moduleId: string) {
    await this.prisma.module.delete({ where: { id: moduleId } });
    await this.purgeCourseCache();
    return { success: true, message: 'Module deleted successfully' };
  }

  async createLesson(moduleId: string, dto: {
    title: string;
    lessonNumber?: number;
    durationMinutes?: number;
    summary?: string;
    notesPdfUrl?: string;
    isFreePreview?: boolean;
  }) {
    const nextLessonNumber =
      dto.lessonNumber ||
      ((await this.prisma.lesson.count({ where: { moduleId } })) + 1);

    const validPdfUrl = validateDriveUrl(dto.notesPdfUrl, 'Lesson Notes PDF');

    const lesson = await this.prisma.lesson.create({
      data: {
        moduleId,
        title: dto.title,
        lessonNumber: nextLessonNumber,
        durationMinutes: dto.durationMinutes || 15,
        summary: dto.summary || '',
        notesPdfUrl: validPdfUrl,
        notesUploadedAt: validPdfUrl ? new Date() : null,
        isFreePreview: dto.isFreePreview || false,
      },
    });

    await this.purgeCourseCache();
    return { success: true, lesson };
  }

  async updateLesson(lessonId: string, dto: {
    title?: string;
    lessonNumber?: number;
    durationMinutes?: number;
    summary?: string;
    notesPdfUrl?: string;
    isFreePreview?: boolean;
  }) {
    const validPdfUrl = dto.notesPdfUrl !== undefined ? validateDriveUrl(dto.notesPdfUrl, 'Lesson Notes PDF') : undefined;

    const lesson = await this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.lessonNumber !== undefined && { lessonNumber: dto.lessonNumber }),
        ...(dto.durationMinutes !== undefined && { durationMinutes: dto.durationMinutes }),
        ...(dto.summary !== undefined && { summary: dto.summary }),
        ...(validPdfUrl !== undefined && {
          notesPdfUrl: validPdfUrl,
          notesUploadedAt: validPdfUrl ? new Date() : null,
        }),
        ...(dto.isFreePreview !== undefined && { isFreePreview: dto.isFreePreview }),
      },
    });

    await this.purgeCourseCache();
    return { success: true, lesson };
  }

  async updateCourseProject(slug: string, dto: {
    projectPdfUrl?: string;
    projectPdfTitle?: string;
  }) {
    const course = await this.prisma.course.findUnique({ where: { slug } });
    if (!course) throw new NotFoundException('Course not found');

    const validProjectPdfUrl = dto.projectPdfUrl !== undefined ? validateDriveUrl(dto.projectPdfUrl, 'Course Project PDF') : undefined;

    const updated = await this.prisma.course.update({
      where: { slug },
      data: {
        ...(validProjectPdfUrl !== undefined && {
          projectPdfUrl: validProjectPdfUrl,
          projectUploadedAt: validProjectPdfUrl ? new Date() : null,
        }),
        ...(dto.projectPdfTitle !== undefined && { projectPdfTitle: dto.projectPdfTitle }),
      },
    });

    await this.purgeCourseCache();
    return { success: true, course: updated };
  }

  async deleteLesson(lessonId: string) {
    await this.prisma.lesson.delete({ where: { id: lessonId } });
    await this.purgeCourseCache();
    return { success: true, message: 'Lesson deleted successfully' };
  }

  async upsertLessonQuiz(lessonId: string, dto: {
    title: string;
    passingScore?: number;
    maxAttempts?: number;
    questions: {
      order?: number;
      question: string;
      options: string[];
      correctOptionIndex: number;
      explanation?: string;
      codeSnippet?: string;
    }[];
  }) {
    // Delete existing quiz questions if quiz exists
    const existingQuiz = await this.prisma.quiz.findUnique({ where: { lessonId } });
    if (existingQuiz) {
      await this.prisma.quizQuestion.deleteMany({ where: { quizId: existingQuiz.id } });
    }

    const quiz = await this.prisma.quiz.upsert({
      where: { lessonId },
      update: {
        title: dto.title,
        passingScore: dto.passingScore || 70,
        maxAttempts: dto.maxAttempts || 3,
        questions: {
          create: dto.questions.map((q, idx) => ({
            order: q.order || idx + 1,
            question: q.question,
            questionText: q.question,
            options: q.options,
            optionsJson: JSON.stringify(q.options),
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation || '',
            codeSnippet: q.codeSnippet || null,
          })),
        },
      },
      create: {
        lessonId,
        title: dto.title,
        passingScore: dto.passingScore || 70,
        maxAttempts: dto.maxAttempts || 3,
        questions: {
          create: dto.questions.map((q, idx) => ({
            order: q.order || idx + 1,
            question: q.question,
            questionText: q.question,
            options: q.options,
            optionsJson: JSON.stringify(q.options),
            correctOptionIndex: q.correctOptionIndex,
            explanation: q.explanation || '',
            codeSnippet: q.codeSnippet || null,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    await this.purgeCourseCache();
    return { success: true, quiz };
  }

  async updateCourseDetails(slug: string, dto: {
    priceInPaise?: number;
    earlyBirdPriceInPaise?: number;
    totalSeats?: number;
    seatsRemaining?: number;
    isPublished?: boolean;
    cohortStartsOn?: Date;
    durationWeeks?: number;
    stipendDetails?: string;
  }) {
    const course = await this.prisma.course.update({
      where: { slug },
      data: {
        ...(dto.priceInPaise !== undefined && { priceInPaise: dto.priceInPaise }),
        ...(dto.earlyBirdPriceInPaise !== undefined && { earlyBirdPriceInPaise: dto.earlyBirdPriceInPaise }),
        ...(dto.totalSeats !== undefined && { totalSeats: dto.totalSeats }),
        ...(dto.seatsRemaining !== undefined && { seatsRemaining: dto.seatsRemaining }),
        ...(dto.isPublished !== undefined && { isPublished: dto.isPublished }),
        ...(dto.cohortStartsOn !== undefined && { cohortStartsOn: new Date(dto.cohortStartsOn) }),
        ...(dto.durationWeeks !== undefined && { durationWeeks: dto.durationWeeks }),
        ...(dto.stipendDetails !== undefined && { stipendDetails: dto.stipendDetails }),
      },
    });

    await this.purgeCourseCache();
    return { success: true, course };
  }

  // ─── Health Check ────────────────────────────────────────────────────────────
  async getHealth() {
    const startDb = Date.now();
    let dbStatus: 'ok' | 'degraded' | 'down' = 'ok';
    let dbLatency = 0;

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - startDb;
      if (dbLatency > 800) {
        dbStatus = 'degraded';
      }
    } catch {
      dbStatus = 'down';
    }

    const razorpayConfigured = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
    const cloudinaryConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
    const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);

    const razorpayStatus: 'ok' | 'down' = razorpayConfigured ? 'ok' : 'down';
    const cloudinaryStatus: 'ok' | 'down' = cloudinaryConfigured ? 'ok' : 'down';
    const smtpStatus: 'ok' | 'down' = smtpConfigured ? 'ok' : 'down';

    let overall: 'ok' | 'degraded' | 'down' = 'ok';
    if (dbStatus === 'down') {
      overall = 'down';
    } else if (
      dbStatus === 'degraded' ||
      razorpayStatus === 'down' ||
      cloudinaryStatus === 'down' ||
      smtpStatus === 'down'
    ) {
      overall = 'degraded';
    }

    return {
      database: dbStatus,
      databaseLatencyMs: dbLatency,
      razorpay: razorpayStatus,
      cloudinary: cloudinaryStatus,
      smtp: smtpStatus,
      overall,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
    };
  }

  /**
   * Reset quiz attempts and submissions for a student so they get 3 fresh attempts.
   */
  async resetUserQuiz(quizId: string, userId: string, adminId?: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { lesson: true },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.prisma.$transaction([
      this.prisma.quizAttempt.deleteMany({
        where: { quizId, userId },
      }),
      this.prisma.quizSubmission.deleteMany({
        where: { quizId, userId },
      }),
      ...(adminId
        ? [
            this.prisma.auditLog.create({
              data: {
                adminId,
                action: 'QUIZ_ATTEMPTS_RESET',
                targetId: quizId,
                targetType: 'Quiz',
                metadata: {
                  studentId: userId,
                  studentEmail: user.email,
                  quizTitle: quiz.title,
                },
              },
            }),
          ]
        : []),
    ]);

    return {
      success: true,
      message: `Quiz attempts for ${user.name} (${user.email}) have been reset. 3 fresh attempts granted.`,
      quizId,
      userId,
    };
  }
}

