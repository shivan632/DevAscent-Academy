import { PrismaService } from '../../prisma/prisma.service';
import { PdfService } from '../../shared/pdf.service';
import { MailService } from '../../shared/mail.service';
export declare class CertificatesService {
    private prisma;
    private pdfService;
    private mailService;
    constructor(prisma: PrismaService, pdfService: PdfService, mailService: MailService);
    generateCertId(): string;
    computeHash(certId: string, name: string, courseTitle: string, issuedAt: string): string;
    issueAndEmailCertificate(userId: string, courseId: string, grade?: string): Promise<{
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
    getMyCertificates(userId: string): Promise<any>;
    getMyCertificate(userId: string, courseId: string): Promise<{
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
    downloadCertificatePdf(certId: string): Promise<{
        buffer: Buffer;
        filename: string;
    }>;
    verify(certId: string): Promise<{
        verified: boolean;
        message: string;
        recipient?: undefined;
        course?: undefined;
        hash?: undefined;
        issuedBy?: undefined;
        instructor?: undefined;
        ledgerTimestamp?: undefined;
    } | {
        verified: boolean;
        recipient: {
            name: any;
            degree: any;
            college: any;
        };
        course: {
            title: any;
            completedAt: any;
            grade: any;
        };
        hash: any;
        issuedBy: string;
        instructor: string;
        ledgerTimestamp: any;
        message?: undefined;
    }>;
}
