import { Request, Response } from 'express';
import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getOverview(): Promise<{
        totalStudents: number;
        activeStudents: number;
        suspendedStudents: number;
        totalEnrollments: number;
        totalRevenueInRupees: number;
        pendingRefunds: number;
        totalSubmissions: number;
        pendingSubmissions: number;
    }>;
    getBadgeCounts(): Promise<{
        pendingRefunds: number;
        pendingSubmissions: number;
    }>;
    getStudents(page: number, limit: number, search?: string, degree?: string, status?: string): Promise<{
        data: {
            id: string;
            name: string;
            email: string;
            degree: string;
            college: string;
            city: string;
            status: string;
            lastLoginAt: Date;
            joinedAt: Date;
            adminNote: string;
            enrollmentCount: number;
            certificateCount: number;
            totalSpentRupees: number;
            enrollments: {
                id: string;
                status: string;
                course: {
                    slug: string;
                    title: string;
                };
                progressPct: number;
            }[];
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getStudentDetail(id: string): Promise<{
        enrollments: ({
            course: {
                slug: string;
                title: string;
            };
        } & {
            id: string;
            status: string;
            courseId: string;
            progressPct: number;
            enrolledAt: Date;
            userId: string;
        })[];
        payments: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            courseId: string;
            userId: string;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            amountInPaise: number;
            currency: string;
        }[];
        certificates: {
            id: string;
            courseId: string;
            userId: string;
            certId: string;
            recipientName: string;
            courseTitle: string;
            sha256Hash: string;
            grade: string;
            pdfUrl: string | null;
            issuedAt: Date;
        }[];
        refunds: {
            id: string;
            status: string;
            createdAt: Date;
            userId: string;
            amountInPaise: number;
            reason: string;
            upiId: string | null;
            rejectionReason: string | null;
            processedAt: Date | null;
            paymentId: string;
        }[];
        completionSubmissions: ({
            course: {
                title: string;
            };
        } & {
            id: string;
            email: string;
            name: string;
            status: string;
            adminNote: string | null;
            courseId: string;
            userId: string;
            reviewedAt: Date | null;
            batch: string;
            projectName: string;
            gitRepoUrl: string;
            linkedinPostUrl: string;
            submittedAt: Date;
        })[];
    } & {
        id: string;
        email: string;
        passwordHash: string;
        name: string;
        phone: string | null;
        role: string;
        degree: string | null;
        college: string | null;
        avatarUrl: string | null;
        bio: string | null;
        city: string | null;
        graduationYear: string | null;
        githubUrl: string | null;
        linkedinUrl: string | null;
        portfolioUrl: string | null;
        isEmailVerified: boolean;
        status: string;
        suspendedAt: Date | null;
        lastLoginAt: Date | null;
        adminNote: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    suspendStudent(id: string, reason: string, admin: any, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    restoreStudent(id: string, admin: any, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    getRefunds(status?: string): Promise<{
        refunds: ({
            user: {
                email: string;
                name: string;
            };
            payment: {
                course: {
                    title: string;
                };
                razorpayOrderId: string;
                razorpayPaymentId: string;
                amountInPaise: number;
            };
        } & {
            id: string;
            status: string;
            createdAt: Date;
            userId: string;
            amountInPaise: number;
            reason: string;
            upiId: string | null;
            rejectionReason: string | null;
            processedAt: Date | null;
            paymentId: string;
        })[];
    }>;
    approveRefund(id: string, admin: any, req: Request): Promise<{
        success: boolean;
        refund: {
            id: string;
            status: string;
            createdAt: Date;
            userId: string;
            amountInPaise: number;
            reason: string;
            upiId: string | null;
            rejectionReason: string | null;
            processedAt: Date | null;
            paymentId: string;
        };
    }>;
    rejectRefund(id: string, reason: string, admin: any, req: Request): Promise<{
        success: boolean;
        refund: {
            id: string;
            status: string;
            createdAt: Date;
            userId: string;
            amountInPaise: number;
            reason: string;
            upiId: string | null;
            rejectionReason: string | null;
            processedAt: Date | null;
            paymentId: string;
        };
    }>;
    getSubmissions(status?: string, page?: number, limit?: number): Promise<{
        submissions: ({
            user: {
                email: string;
                name: string;
            };
            course: {
                slug: string;
                title: string;
            };
        } & {
            id: string;
            email: string;
            name: string;
            status: string;
            adminNote: string | null;
            courseId: string;
            userId: string;
            reviewedAt: Date | null;
            batch: string;
            projectName: string;
            gitRepoUrl: string;
            linkedinPostUrl: string;
            submittedAt: Date;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    approveSubmission(id: string, adminNote: string, admin: any, req: Request): Promise<{
        success: boolean;
    }>;
    rejectSubmission(id: string, reason: string, admin: any, req: Request): Promise<{
        success: boolean;
    }>;
    bulkApproveSubmissions(ids: string[], admin: any): Promise<{
        success: boolean;
        count: number;
    }>;
    getCourseStats(): Promise<{
        courses: {
            id: string;
            slug: string;
            title: string;
            type: string;
            isPublished: boolean;
            enrollmentCount: number;
            certificateCount: number;
            avgProgress: number;
            revenueRupees: number;
        }[];
    }>;
    getAnalytics(): Promise<{
        signupsByDay: Record<string, number>;
        revenueByDay: Record<string, number>;
    }>;
    getAuditLog(page: number, limit: number, action?: string, adminId?: string): Promise<{
        logs: ({
            admin: {
                email: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            action: string;
            targetId: string | null;
            targetType: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
            adminId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    exportStudents(res: Response): Promise<Response<any, Record<string, any>>>;
    exportRevenue(res: Response): Promise<Response<any, Record<string, any>>>;
    updateRole(userId: string, role: string, admin: any, req: Request): Promise<{
        success: boolean;
    }>;
}
