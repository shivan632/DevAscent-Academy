import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RefundsService {
  constructor(private prisma: PrismaService) {}

  async applyRefund(userId: string, orderId: string, reason: string, upiId?: string) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        userId,
        OR: [{ razorpayOrderId: orderId }, { id: orderId }],
      },
      include: {
        course: {
          include: {
            modules: {
              include: { lessons: true },
            },
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment order not found for this account.');
    }

    if (payment.status !== 'PAID') {
      throw new BadRequestException('Only completed payments can be refunded.');
    }

    // Check 7-day refund policy window
    const daysSincePayment =
      (Date.now() - new Date(payment.createdAt).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSincePayment > 7) {
      return {
        status: 'REJECTED',
        message: 'The 7-day refund policy window has elapsed since your enrollment.',
      };
    }

    // Check consumption limit (15% course progress rule)
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: payment.courseId },
      },
    });

    if (enrollment && enrollment.progressPct > 15) {
      return {
        status: 'REJECTED',
        message:
          'Refund policy requires that less than 15% of the course content has been consumed.',
      };
    }

    // Check certificate issuance
    const cert = await this.prisma.certificate.findFirst({
      where: { userId, courseId: payment.courseId },
    });

    if (cert) {
      return {
        status: 'REJECTED',
        message: 'A completion certificate has already been issued for this enrollment.',
      };
    }

    // Create refund ticket
    const refund = await this.prisma.refund.create({
      data: {
        userId,
        paymentId: payment.id,
        amountInPaise: payment.amountInPaise,
        reason,
        upiId,
        status: 'SUBMITTED',
      },
    });

    return {
      refundId: refund.id,
      status: 'SUBMITTED',
      message:
        'Your refund request has been received under our 7-Day Guarantee. Our team processes refunds within 24-48 business hours back to your original payment method or UPI.',
    };
  }

  async getStatus(refundId: string) {
    const refund = await this.prisma.refund.findUnique({
      where: { id: refundId },
    });

    if (!refund) {
      throw new NotFoundException('Refund ticket not found');
    }

    return {
      refundId: refund.id,
      status: refund.status,
      amountInPaise: refund.amountInPaise,
      createdAt: refund.createdAt,
      processedAt: refund.processedAt,
      rejectionReason: refund.rejectionReason,
    };
  }
}
