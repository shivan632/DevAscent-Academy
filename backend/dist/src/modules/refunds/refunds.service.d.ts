import { PrismaService } from '../../prisma/prisma.service';
export declare class RefundsService {
    private prisma;
    constructor(prisma: PrismaService);
    applyRefund(userId: string, orderId: string, reason: string, upiId?: string): Promise<{
        status: string;
        message: string;
        refundId?: undefined;
    } | {
        refundId: string;
        status: string;
        message: string;
    }>;
    getStatus(refundId: string): Promise<{
        refundId: string;
        status: string;
        amountInPaise: number;
        createdAt: Date;
        processedAt: Date;
        rejectionReason: string;
    }>;
}
