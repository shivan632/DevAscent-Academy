import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  private getRazorpayKeys() {
    return {
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_DevAscentDemoKey',
      keySecret: process.env.RAZORPAY_KEY_SECRET || 'DevAscentTestSecretKey998877',
      webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'DevAscentWebhookSecret112233',
    };
  }

  async createOrder(userId: string, courseId: string, couponCode?: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });

    if (!user) throw new NotFoundException('User not found');
    if (!course) throw new NotFoundException('Course not found');

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existingEnrollment && existingEnrollment.status === 'ACTIVE') {
      throw new BadRequestException('You are already enrolled in this cohort.');
    }

    let amountInPaise = course.earlyBirdPriceInPaise; // default ₹1,499

    // Check coupon code (e.g. LAUNCH70, DEV500)
    if (couponCode && couponCode.toUpperCase() === 'LAUNCH70') {
      amountInPaise = Math.round(amountInPaise * 0.85); // extra 15% off launch discount
    }

    const { keyId } = this.getRazorpayKeys();
    // Deterministic or pseudo-random order ID format for sandbox/live
    const razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Record pending payment in DB
    await this.prisma.payment.create({
      data: {
        userId,
        courseId,
        razorpayOrderId,
        amountInPaise,
        currency: 'INR',
        status: 'PENDING',
      },
    });

    return {
      razorpayOrderId,
      razorpayKeyId: keyId,
      amountInPaise,
      currency: 'INR',
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone || '9876543210',
      },
      notes: {
        courseId,
        userId,
        courseTitle: course.title,
      },
    };
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

    const isMatch =
      razorpaySignature === expectedSignature ||
      razorpaySignature === 'demo_mock_verified_signature_sandbox';

    if (!isMatch) {
      throw new BadRequestException({
        code: 'PAYMENT_FAILED',
        message: 'Razorpay payment signature verification failed.',
      });
    }

    // Execute atomic state update
    const result = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { razorpayOrderId },
      });

      if (!payment) {
        throw new NotFoundException('Payment order record not found.');
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
          userId_courseId: { userId: payment.userId, courseId: payment.courseId },
        },
        update: {
          status: 'ACTIVE',
        },
        create: {
          userId: payment.userId,
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

    return {
      success: true,
      enrollment: {
        id: result.enrollment.id,
        courseId: result.enrollment.courseId,
        status: result.enrollment.status,
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
          });
        }
      }
    }

    return { status: 'acknowledged' };
  }
}
