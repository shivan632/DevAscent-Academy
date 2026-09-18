import { Request } from 'express';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(userId: string, courseId: string, couponCode?: string): Promise<{
        razorpayOrderId: string;
        razorpayKeyId: string;
        amountInPaise: number;
        currency: string;
        prefill: {
            name: string;
            email: string;
            contact: string;
        };
        notes: {
            courseId: string;
            userId: string;
            courseTitle: string;
        };
    }>;
    verifyPayment(userId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
        success: boolean;
        enrollment: {
            id: string;
            courseId: string;
            status: string;
        };
        invoiceUrl: string;
    }>;
    handleWebhook(req: Request, signature: string): Promise<{
        status: string;
    }>;
}
