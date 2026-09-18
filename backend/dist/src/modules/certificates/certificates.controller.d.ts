import { Response } from 'express';
import { CertificatesService } from './certificates.service';
export declare class CertificatesController {
    private certificatesService;
    constructor(certificatesService: CertificatesService);
    getMyCertificates(user: any): Promise<any>;
    getMyCertificate(user: any, courseId: string): Promise<{
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
