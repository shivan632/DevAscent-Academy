export declare class MailService {
    private readonly logger;
    private resend;
    private fromEmail;
    constructor();
    sendOtpEmail(toEmail: string, name: string, otpCode: string): Promise<boolean>;
    sendCertificateEmail(toEmail: string, name: string, courseTitle: string, certId: string, pdfBuffer: Buffer): Promise<boolean>;
}
