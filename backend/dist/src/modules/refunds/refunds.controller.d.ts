import { RefundsService } from './refunds.service';
export declare class RefundsController {
    private refundsService;
    constructor(refundsService: RefundsService);
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
