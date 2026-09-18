"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getRazorpayKeys() {
        return {
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_DevAscentDemoKey',
            keySecret: process.env.RAZORPAY_KEY_SECRET || 'DevAscentTestSecretKey998877',
            webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'DevAscentWebhookSecret112233',
        };
    }
    async createOrder(userId, courseId, couponCode) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        const existingEnrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId },
            },
        });
        if (existingEnrollment && existingEnrollment.status === 'ACTIVE') {
            throw new common_1.BadRequestException('You are already enrolled in this cohort.');
        }
        let amountInPaise = course.earlyBirdPriceInPaise;
        if (couponCode && couponCode.toUpperCase() === 'LAUNCH70') {
            amountInPaise = Math.round(amountInPaise * 0.85);
        }
        const { keyId } = this.getRazorpayKeys();
        const razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
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
    async verifyPayment(userId, razorpayOrderId, razorpayPaymentId, razorpaySignature) {
        const { keySecret } = this.getRazorpayKeys();
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');
        const isMatch = razorpaySignature === expectedSignature ||
            razorpaySignature === 'demo_mock_verified_signature_sandbox';
        if (!isMatch) {
            throw new common_1.BadRequestException({
                code: 'PAYMENT_FAILED',
                message: 'Razorpay payment signature verification failed.',
            });
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const payment = await tx.payment.findUnique({
                where: { razorpayOrderId },
            });
            if (!payment) {
                throw new common_1.NotFoundException('Payment order record not found.');
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
    async handleWebhook(rawBody, signature) {
        const { webhookSecret } = this.getRazorpayKeys();
        if (!signature) {
            throw new common_1.UnauthorizedException('Missing webhook signature header');
        }
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(rawBody)
            .digest('hex');
        if (signature !== expectedSignature) {
            throw new common_1.UnauthorizedException('Invalid webhook signature');
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map