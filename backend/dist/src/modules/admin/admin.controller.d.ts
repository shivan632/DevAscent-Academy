import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getOverview(): Promise<{
        totalStudents: number;
        totalEnrollments: number;
        totalRevenueInRupees: number;
        pendingRefunds: number;
    }>;
    getStudents(): Promise<{
        students: {
            id: string;
            name: string;
            email: string;
            degree: string;
            college: string;
            joinedAt: Date;
            enrollmentCount: number;
            totalSpent: number;
            enrollments: {
                id: string;
                course: {
                    title: string;
                };
                progressPct: number;
                status: string;
            }[];
        }[];
    }>;
    getRefunds(status?: string): Promise<{
        refunds: ({
            user: {
                email: string;
                name: string;
            };
            payment: {
                razorpayOrderId: string;
                amountInPaise: number;
            };
        } & {
            id: string;
            createdAt: Date;
            status: string;
            userId: string;
            amountInPaise: number;
            reason: string;
            upiId: string | null;
            rejectionReason: string | null;
            processedAt: Date | null;
            paymentId: string;
        })[];
    }>;
    approveRefund(id: string): Promise<{
        success: boolean;
        refund: {
            id: string;
            createdAt: Date;
            status: string;
            userId: string;
            amountInPaise: number;
            reason: string;
            upiId: string | null;
            rejectionReason: string | null;
            processedAt: Date | null;
            paymentId: string;
        };
    }>;
    rejectRefund(id: string, reason: string): Promise<{
        success: boolean;
        refund: {
            id: string;
            createdAt: Date;
            status: string;
            userId: string;
            amountInPaise: number;
            reason: string;
            upiId: string | null;
            rejectionReason: string | null;
            processedAt: Date | null;
            paymentId: string;
        };
    }>;
}
