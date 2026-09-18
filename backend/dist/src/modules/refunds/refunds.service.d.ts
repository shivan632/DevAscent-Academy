import { PrismaService } from '../../prisma/prisma.service';
export declare class RefundsService {
    private prisma;
    constructor(prisma: PrismaService);
    applyRefund(userId: string, orderId: string, reason: string, upiId?: string): Promise<{
        status: string;
        message: string;
        refundId?: undefined;
    } | {
        refundId: any;
        status: string;
        message: string;
    }>;
    getStatus(refundId: string): Promise<{
        refundId: any;
        status: any;
        amountInPaise: any;
        createdAt: any;
        processedAt: any;
        rejectionReason: any;
    }>;
}
