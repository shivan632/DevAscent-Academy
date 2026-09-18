export declare class PdfService {
    private logoPath;
    generatePdfBuffer(details: {
        certId: string;
        recipientName: string;
        courseTitle: string;
        grade: string;
        issuedAt: string;
        verifyUrl: string;
        sha256Hash?: string;
    }): Promise<Buffer>;
}
