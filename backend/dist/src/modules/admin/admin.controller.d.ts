import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
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
    approveRefund(id: string): Promise<{
        success: boolean;
        refund: any;
    }>;
    rejectRefund(id: string, reason: string): Promise<{
        success: boolean;
        refund: any;
    }>;
}
