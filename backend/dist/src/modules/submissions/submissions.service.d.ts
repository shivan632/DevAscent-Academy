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
        submission: any;
    }>;
    getMySubmissions(userId: string): Promise<any>;
    getAllSubmissions(status?: string): Promise<any>;
    approveSubmission(submissionId: string, adminNote?: string): Promise<{
        success: boolean;
        message: string;
        submission: any;
        certificate: {
            certId: any;
            sha256Hash: any;
            recipientName: any;
            courseTitle: any;
            issuedAt: any;
            verifyUrl: string;
            grade: any;
        };
    }>;
    rejectSubmission(submissionId: string, reason: string): Promise<{
        success: boolean;
        message: string;
        submission: any;
    }>;
}
