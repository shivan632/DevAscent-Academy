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
            certId: string;
            sha256Hash: string;
            recipientName: string;
            courseTitle: string;
            issuedAt: string;
            verifyUrl: string;
            grade: string;
        };
    }>;
    getMyCertificates(userId: string): Promise<{
        certId: string;
        sha256Hash: string;
        recipientName: string;
        courseTitle: string;
        issuedAt: string;
        verifyUrl: string;
        grade: string;
    }[]>;
    getMyCertificate(userId: string, courseId: string): Promise<{
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
            name: string;
            degree: string;
            college: string;
        };
        course: {
            title: string;
            completedAt: string;
            grade: string;
        };
        hash: string;
        issuedBy: string;
        instructor: string;
        ledgerTimestamp: string;
        message?: undefined;
    }>;
}
