import { PrismaService } from '../../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getRazorpayKeys;
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
    handleWebhook(rawBody: string, signature: string): Promise<{
        status: string;
    }>;
}
