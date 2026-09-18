import { Response } from 'express';
import { CertificatesService } from './certificates.service';
export declare class CertificatesController {
    private certificatesService;
    constructor(certificatesService: CertificatesService);
    getMyCertificates(user: any): Promise<{
        certId: string;
        sha256Hash: string;
        recipientName: string;
        courseTitle: string;
        issuedAt: string;
        verifyUrl: string;
        grade: string;
    }[]>;
    getMyCertificate(user: any, courseId: string): Promise<{
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
    downloadCertificate(certId: string, res: Response): Promise<void>;
    verifyCertificate(certId: string): Promise<{
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
