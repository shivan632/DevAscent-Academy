import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
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
    const [pendingRefunds, pendingSubmissions] = await Promise.all([
      this.prisma.refund.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.completionSubmission.count({ where: { status: 'PENDING' } }),
    ]);
    return { pendingRefunds, pendingSubmissions };
  }

  // ─── Students (Paginated) ───────────────────────────────────────────────────
  async getStudents(
    page = 1,
    limit = 20,
    filters: {
      search?: string;
      degree?: string;
      status?: string;
    } = {},
  ) {
    const skip = (page - 1) * limit;
    const where: any = { role: 'STUDENT' };

    if (filters.status) where.status = filters.status;
    if (filters.degree) where.degree = filters.degree;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
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
          degree: true,
          college: true,
          city: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
          adminNote: true,
          enrollments: {
            select: {
              id: true,
              progressPct: true,
              status: true,
              course: { select: { title: true, slug: true } },
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
        degree: s.degree,
        college: s.college,
        city: s.city,
        status: s.status,
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

  // ─── Single Student Detail ───────────────────────────────────────────────────
  async getStudentDetail(studentId: string) {
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          include: { course: { select: { title: true, slug: true } } },
        },
        certificates: true,
        payments: true,
        refunds: true,
        completionSubmissions: {
          include: { course: { select: { title: true } } },
        },
      },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
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
}
