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
exports.RefundsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RefundsService = class RefundsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async applyRefund(userId, orderId, reason, upiId) {
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
            throw new common_1.NotFoundException('Payment order not found for this account.');
        }
        if (payment.status !== 'PAID') {
            throw new common_1.BadRequestException('Only completed payments can be refunded.');
        }
        const daysSincePayment = (Date.now() - new Date(payment.createdAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSincePayment > 7) {
            return {
                status: 'REJECTED',
                message: 'The 7-day refund policy window has elapsed since your enrollment.',
            };
        }
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId: payment.courseId },
            },
        });
        if (enrollment && enrollment.progressPct > 15) {
            return {
                status: 'REJECTED',
                message: 'Refund policy requires that less than 15% of the course content has been consumed.',
            };
        }
        const cert = await this.prisma.certificate.findFirst({
            where: { userId, courseId: payment.courseId },
        });
        if (cert) {
            return {
                status: 'REJECTED',
                message: 'A completion certificate has already been issued for this enrollment.',
            };
        }
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
            message: 'Your refund request has been received under our 7-Day Guarantee. Our team processes refunds within 24-48 business hours back to your original payment method or UPI.',
        };
    }
    async getStatus(refundId) {
        const refund = await this.prisma.refund.findUnique({
            where: { id: refundId },
        });
        if (!refund) {
            throw new common_1.NotFoundException('Refund ticket not found');
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
};
exports.RefundsService = RefundsService;
exports.RefundsService = RefundsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RefundsService);
//# sourceMappingURL=refunds.service.js.map