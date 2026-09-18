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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
                totalSpent: Math.round(s.payments.reduce((acc, curr) => acc + curr.amountInPaise, 0) / 100),
                enrollments: s.enrollments,
            })),
        };
    }
    async getRefunds(status) {
        const where = {};
        if (status)
            where.status = status;
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
    async approveRefund(refundId) {
        const refund = await this.prisma.refund.findUnique({ where: { id: refundId } });
        if (!refund)
            throw new common_1.NotFoundException('Refund not found');
        const updated = await this.prisma.refund.update({
            where: { id: refundId },
            data: {
                status: 'APPROVED',
                processedAt: new Date(),
            },
        });
        await this.prisma.payment.update({
            where: { id: refund.paymentId },
            data: { status: 'REFUNDED' },
        });
        return { success: true, refund: updated };
    }
    async rejectRefund(refundId, reason) {
        const refund = await this.prisma.refund.findUnique({ where: { id: refundId } });
        if (!refund)
            throw new common_1.NotFoundException('Refund not found');
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map