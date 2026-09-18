import { PrismaService } from '../../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getRazorpayKeys;
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
    handleWebhook(rawBody: string, signature: string): Promise<{
        status: string;
    }>;
}
