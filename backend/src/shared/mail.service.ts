import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend | null = null;
  private fromEmail = process.env.EMAIL_FROM || 'DevAscent Academy <onboarding@resend.dev>';

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.logger.warn('RESEND_API_KEY not configured. Outgoing emails will be logged to console.');
    }
  }

  async sendOtpEmail(toEmail: string, name: string, otpCode: string): Promise<boolean> {
    const subject = `Your Verification Code: ${otpCode} - DevAscent Academy`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #4f46e5; margin: 0; font-size: 24px; font-weight: 700;">DevAscent Academy</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Empowering Next-Gen Engineers</p>
        </div>
        <p style="font-size: 16px; color: #1e293b;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
          Thank you for signing up with DevAscent Academy. Please use the verification code below to verify your email and activate your student account:
        </p>
        <div style="margin: 28px 0; text-align: center;">
          <div style="display: inline-block; background: #f8fafc; border: 2px dashed #6366f1; border-radius: 12px; padding: 16px 36px;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #4338ca; font-family: monospace;">${otpCode}</span>
          </div>
        </div>
        <p style="font-size: 13px; color: #64748b; text-align: center;">
          ⏳ This code is valid for <strong>10 minutes</strong>. For your security, do not share this code with anyone.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          If you did not initiate this request, you can safely ignore this email.
        </p>
      </div>
    `;

    if (!this.resend) {
      this.logger.log(`[SIMULATED EMAIL] To: ${toEmail} | OTP: ${otpCode}`);
      return true;
    }

    try {
      const response = await this.resend.emails.send({
        from: this.fromEmail,
        to: toEmail,
        subject,
        html,
      });
      if (response.error) {
        this.logger.error(`Resend email error: ${JSON.stringify(response.error)}`);
        return false;
      }
      return true;
    } catch (err) {
      this.logger.error(`Failed to send OTP email: ${err.message}`);
      return false;
    }
  }

  async sendCertificateEmail(
    toEmail: string,
    name: string,
    courseTitle: string,
    certId: string,
    pdfBuffer: Buffer,
  ): Promise<boolean> {
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${certId}`;
    const subject = `🎉 Congratulations ${name}! Your Official Certificate for ${courseTitle}`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #4f46e5; margin: 0; font-size: 26px; font-weight: 700;">DevAscent Academy</h2>
          <span style="background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; display: inline-block; margin-top: 8px;">Official Credential Issued</span>
        </div>
        <p style="font-size: 16px; color: #1e293b;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 15px; color: #334155; line-height: 1.6;">
          Your final project submission for <strong>${courseTitle}</strong> has been reviewed and officially approved by the academy!
        </p>
        <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 6px 0; font-size: 14px; color: #475569;"><strong>Certificate ID:</strong> <code style="color: #4f46e5;">${certId}</code></p>
          <p style="margin: 0; font-size: 14px; color: #475569;">
            <strong>Public Verification Link:</strong><br/>
            <a href="${verifyUrl}" style="color: #4f46e5; word-break: break-all;">${verifyUrl}</a>
          </p>
        </div>
        <p style="font-size: 14px; color: #334155;">
          📎 Your tamper-proof official PDF certificate with embedded verification QR code is attached to this email. You can also download it anytime from your student dashboard.
        </p>
        <div style="text-align: center; margin-top: 24px;">
          <a href="${verifyUrl}" style="background: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; display: inline-block;">
            View Verified Credential
          </a>
        </div>
      </div>
    `;

    if (!this.resend) {
      this.logger.log(`[SIMULATED EMAIL] To: ${toEmail} | Certificate: ${certId} attached (${pdfBuffer.length} bytes)`);
      return true;
    }

    try {
      const response = await this.resend.emails.send({
        from: this.fromEmail,
        to: toEmail,
        subject,
        html,
        attachments: [
          {
            filename: `${certId}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
      if (response.error) {
        this.logger.error(`Resend certificate email error: ${JSON.stringify(response.error)}`);
        return false;
      }
      return true;
    } catch (err) {
      this.logger.error(`Failed to send certificate email: ${err.message}`);
      return false;
    }
  }
}
