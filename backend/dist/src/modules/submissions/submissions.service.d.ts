import { PrismaService } from '../../prisma/prisma.service';
import { CertificatesService } from '../certificates/certificates.service';
export declare class SubmissionsService {
    private prisma;
    private certificatesService;
    constructor(prisma: PrismaService, certificatesService: CertificatesService);
    submitCompletion(userId: string, dto: {
        courseId: string;
        batch: string;
        projectName: string;
        gitRepoUrl: string;
        linkedinPostUrl: string;
    }): Promise<{
        success: boolean;
        message: string;
        submission: {
            id: string;
            email: string;
            name: string;
            courseId: string;
            status: string;
            userId: string;
            adminNote: string | null;
            reviewedAt: Date | null;
            batch: string;
            projectName: string;
            gitRepoUrl: string;
            linkedinPostUrl: string;
            submittedAt: Date;
        };
    }>;
    getMySubmissions(userId: string): Promise<({
        course: {
            slug: string;
            title: string;
            type: string;
        };
    } & {
        id: string;
        email: string;
        name: string;
        courseId: string;
        status: string;
        userId: string;
        adminNote: string | null;
        reviewedAt: Date | null;
        batch: string;
        projectName: string;
        gitRepoUrl: string;
        linkedinPostUrl: string;
        submittedAt: Date;
    })[]>;
    getAllSubmissions(status?: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            phone: string;
            degree: string;
            college: string;
        };
        course: {
            id: string;
            slug: string;
            title: string;
            type: string;
        };
    } & {
        id: string;
        email: string;
        name: string;
        courseId: string;
        status: string;
        userId: string;
        adminNote: string | null;
        reviewedAt: Date | null;
        batch: string;
        projectName: string;
        gitRepoUrl: string;
        linkedinPostUrl: string;
        submittedAt: Date;
    })[]>;
    approveSubmission(submissionId: string, adminNote?: string): Promise<{
        success: boolean;
        message: string;
        submission: {
            id: string;
            email: string;
            name: string;
            courseId: string;
            status: string;
            userId: string;
            adminNote: string | null;
            reviewedAt: Date | null;
            batch: string;
            projectName: string;
            gitRepoUrl: string;
            linkedinPostUrl: string;
            submittedAt: Date;
        };
        certificate: {
            certId: string;
            sha256Hash: string;
            recipientName: string;
            courseTitle: string;
            issuedAt: string;
            verifyUrl: string;
            grade: string;
        };
    }>;
    rejectSubmission(submissionId: string, reason: string): Promise<{
        success: boolean;
        message: string;
        submission: {
            id: string;
            email: string;
            name: string;
            courseId: string;
            status: string;
            userId: string;
            adminNote: string | null;
            reviewedAt: Date | null;
            batch: string;
            projectName: string;
            gitRepoUrl: string;
            linkedinPostUrl: string;
            submittedAt: Date;
        };
    }>;
}
