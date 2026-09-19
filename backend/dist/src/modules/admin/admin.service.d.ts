import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    private logAction;
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
    getStudents(page?: number, limit?: number, filters?: {
        search?: string;
        degree?: string;
        status?: string;
    }): Promise<{
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
    getStudentDetail(studentId: string): Promise<{
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
    suspendStudent(adminId: string, studentId: string, reason: string, ipAddress?: string, userAgent?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    restoreStudent(adminId: string, studentId: string, ipAddress?: string, userAgent?: string): Promise<{
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
    approveRefund(adminId: string, refundId: string, ipAddress?: string, userAgent?: string): Promise<{
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
    rejectRefund(adminId: string, refundId: string, reason: string, ipAddress?: string, userAgent?: string): Promise<{
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
    approveSubmission(adminId: string, submissionId: string, adminNote?: string, ipAddress?: string, userAgent?: string): Promise<{
        success: boolean;
    }>;
    rejectSubmission(adminId: string, submissionId: string, reason: string, ipAddress?: string, userAgent?: string): Promise<{
        success: boolean;
    }>;
    bulkApproveSubmissions(adminId: string, submissionIds: string[]): Promise<{
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
    getAuditLog(page?: number, limit?: number, filters?: {
        action?: string;
        adminId?: string;
    }): Promise<{
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
    exportStudentsCSV(): Promise<string>;
    exportRevenueCSV(): Promise<string>;
    updateUserRole(adminId: string, targetUserId: string, newRole: string, ipAddress?: string, userAgent?: string): Promise<{
        success: boolean;
    }>;
}
