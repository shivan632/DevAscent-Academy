import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getOverview(): Promise<{
        totalStudents: any;
        totalEnrollments: any;
        totalRevenueInRupees: number;
        pendingRefunds: any;
    }>;
    getStudents(): Promise<{
        students: any;
    }>;
    getRefunds(status?: string): Promise<{
        refunds: any;
    }>;
    approveRefund(refundId: string): Promise<{
        success: boolean;
        refund: any;
    }>;
    rejectRefund(refundId: string, reason: string): Promise<{
        success: boolean;
        refund: any;
    }>;
}
