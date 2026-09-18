import { Request } from 'express';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(userId: string, courseId: string, couponCode?: string): Promise<{
        razorpayOrderId: string;
        razorpayKeyId: string;
        amountInPaise: any;
        currency: string;
        prefill: {
            name: any;
            email: any;
            contact: any;
        };
        notes: {
            courseId: string;
            userId: string;
            courseTitle: any;
        };
    }>;
    verifyPayment(userId: string, razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<{
        success: boolean;
        enrollment: {
            id: any;
            courseId: any;
            status: any;
        };
        invoiceUrl: string;
    }>;
    handleWebhook(req: Request, signature: string): Promise<{
        status: string;
    }>;
}
