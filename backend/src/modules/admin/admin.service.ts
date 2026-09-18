import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const totalStudents = await this.prisma.user.count({ where: { role: 'STUDENT' } });
    const totalEnrollments = await this.prisma.enrollment.count();
    const paidPayments = await this.prisma.payment.findMany({ where: { status: 'PAID' } });
    const totalRevenueInPaise = paidPayments.reduce((acc, curr) => acc + curr.amountInPaise, 0);
    const pendingRefunds = await this.prisma.refund.count({ where: { status: 'SUBMITTED' } });

    return {
      totalStudents,
      totalEnrollments,
      totalRevenueInRupees: Math.round(totalRevenueInPaise / 100),
      pendingRefunds,
    };
  }

  async getStudents() {
    const students = await this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        degree: true,
        college: true,
        createdAt: true,
        enrollments: {
          select: {
            id: true,
            progressPct: true,
            status: true,
            course: { select: { title: true } },
          },
        },
        payments: {
          where: { status: 'PAID' },
          select: { amountInPaise: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      students: students.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        degree: s.degree,
        college: s.college,
        joinedAt: s.createdAt,
        enrollmentCount: s.enrollments.length,
        totalSpent: Math.round(
          s.payments.reduce((acc, curr) => acc + curr.amountInPaise, 0) / 100,
        ),
        enrollments: s.enrollments,
      })),
    };
  }

  async getRefunds(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    const refunds = await this.prisma.refund.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        payment: { select: { razorpayOrderId: true, amountInPaise: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { refunds };
  }

  async approveRefund(refundId: string) {
    const refund = await this.prisma.refund.findUnique({ where: { id: refundId } });
    if (!refund) throw new NotFoundException('Refund not found');

    const updated = await this.prisma.refund.update({
      where: { id: refundId },
      data: {
        status: 'APPROVED',
        processedAt: new Date(),
      },
    });

    // Mark enrollment as refunded
    await this.prisma.payment.update({
      where: { id: refund.paymentId },
      data: { status: 'REFUNDED' },
    });

    return { success: true, refund: updated };
  }

  async rejectRefund(refundId: string, reason: string) {
    const refund = await this.prisma.refund.findUnique({ where: { id: refundId } });
    if (!refund) throw new NotFoundException('Refund not found');

    const updated = await this.prisma.refund.update({
      where: { id: refundId },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        processedAt: new Date(),
      },
    });

    return { success: true, refund: updated };
  }
}
