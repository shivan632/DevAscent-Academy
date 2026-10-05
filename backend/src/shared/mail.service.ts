import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend | null = null;
  private transporter: nodemailer.Transporter | null = null;
  private fromEmail = process.env.EMAIL_FROM || 'DevAscent Academy <shivrom.2020@gmail.com>';

  constructor() {
    // 1. Prioritize Resend HTTP API (Port 443 HTTPS - works on Render Free Tier without SMTP blocks)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && !resendKey.includes('placeholder')) {
      this.resend = new Resend(resendKey);
      this.logger.log('📧 Resend HTTP API Mailer initialized (Port 443 HTTPS - Render firewall proof)');
    }

    // 2. Secondary: Gmail SMTP (for local environment or paid servers where SMTP is open)
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || 'shivrom.2020@gmail.com';
    const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || 'mqvy tvzt yykk hczt').replace(/\s+/g, '');

    if (smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      this.logger.log(`📧 Gmail SMTP Mailer initialized for: ${smtpUser}`);
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
          ⏳ This code is valid for <strong>15 minutes</strong>. For your security, do not share this code with anyone.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          If you did not initiate this request, you can safely ignore this email.
        </p>
      </div>
    `;

    // 1. Send via Resend HTTP API first (Never blocked by Render cloud firewall)
    if (this.resend) {
      try {
        const fromHeader = process.env.RESEND_FROM || 'DevAscent Academy <onboarding@resend.dev>';
        const response = await this.resend.emails.send({
          from: fromHeader,
          to: toEmail,
          subject,
          html,
        });

        if (response.error) {
          this.logger.error(`Resend email error: ${JSON.stringify(response.error)}`);
        } else {
          this.logger.log(`✅ OTP email delivered to ${toEmail} via Resend HTTP API`);
          return true;
        }
      } catch (err: any) {
        this.logger.error(`Failed to send OTP email via Resend: ${err.message}`);
      }
    }

    // 2. Fallback to Nodemailer SMTP (Works on local or hosts where SMTP ports are open)
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: this.fromEmail,
          to: toEmail,
          subject,
          html,
        });
        this.logger.log(`✅ OTP email delivered to ${toEmail} via Gmail SMTP`);
        return true;
      } catch (err: any) {
        this.logger.error(`Gmail SMTP OTP send failed: ${err.message}`);
      }
    }

    this.logger.log(`[SIMULATED EMAIL] To: ${toEmail} | OTP: ${otpCode}`);
    return true;
  }

  async testDiagnostic(toEmail = 'shivanmishra203@gmail.com'): Promise<any> {
    if (!this.transporter) {
      return { status: 'no_transporter', fromEmail: this.fromEmail, resend: !!this.resend };
    }
    try {
      const verifyRes = await this.transporter.verify();
      const sendRes = await this.transporter.sendMail({
        from: this.fromEmail,
        to: toEmail,
        subject: `[Diagnostic] DevAscent SMTP Test ${new Date().toISOString()}`,
        text: 'SMTP diagnostic test from server.',
      });
      return { status: 'success', verify: verifyRes, messageId: sendRes.messageId, response: sendRes.response };
    } catch (err: any) {
      return { status: 'error', message: err.message, code: err.code, response: err.response, stack: err.stack };
    }
  }

  async sendCertificateEmail(
    toEmail: string,
    name: string,
    courseTitle: string,
    certId: string,
    pdfBuffer: Buffer,
  ): Promise<boolean> {
    const verifyUrl = `${process.env.FRONTEND_URL || 'https://dev-ascent-academy.vercel.app'}/verify/${certId}`;
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

    // 1. Send via Resend HTTP API first (Render firewall proof)
    if (this.resend) {
      try {
        const fromHeader = process.env.RESEND_FROM || 'DevAscent Academy <onboarding@resend.dev>';
        const response = await this.resend.emails.send({
          from: fromHeader,
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
        } else {
          this.logger.log(`✅ Certificate email delivered to ${toEmail} via Resend HTTP API`);
          return true;
        }
      } catch (err: any) {
        this.logger.error(`Failed to send certificate email via Resend: ${err.message}`);
      }
    }

    // 2. Fallback to Nodemailer SMTP
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
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
        this.logger.log(`✅ Certificate email delivered to ${toEmail} via Gmail SMTP`);
        return true;
      } catch (err: any) {
        this.logger.error(`Gmail SMTP Certificate send failed: ${err.message}`);
      }
    }

    this.logger.log(`[SIMULATED EMAIL] To: ${toEmail} | Certificate: ${certId} attached (${pdfBuffer.length} bytes)`);
    return true;
  }

  // ─── Phase 6: Enrollment Confirmation & Payment Receipt Email ─────────────
  async sendEnrollmentEmail(
    toEmail: string,
    name: string,
    courseTitle: string,
    orderId: string,
    amountInRupees: number,
    courseSlug: string,
  ): Promise<boolean> {
    const dashboardUrl = `${process.env.FRONTEND_URL || 'https://dev-ascent-academy.vercel.app'}/learn/${courseSlug}`;
    const subject = `🎉 Welcome to ${courseTitle}! Your Enrollment is Confirmed`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #6366f1); color: #ffffff; font-weight: 800; font-size: 18px; padding: 10px 18px; border-radius: 12px; margin-bottom: 8px;">
            DevAscent Academy
          </div>
          <h2 style="color: #1e293b; margin: 8px 0 0 0; font-size: 22px; font-weight: 800;">Welcome to the Cohort, ${name}! 🚀</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Your seat has been officially reserved.</p>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; color: #334155;">Enrollment & Payment Summary</h3>
          <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Program:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #1e293b;">${courseTitle}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Order / Ref ID:</td>
              <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: 600; color: #4f46e5;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Amount Paid:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #059669;">₹${amountInRupees.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b;">Guarantee:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #059669;">7-Day Full Money-Back</td>
            </tr>
          </table>
        </div>

        <div style="margin: 24px 0; text-align: center;">
          <a href="${dashboardUrl}" style="background: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
            Launch Learning Workspace →
          </a>
        </div>

        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 6px; margin-top: 20px;">
          <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.5;">
            💡 <strong>Next Step:</strong> Complete your daily lessons, pass the milestone skill assessments, and join the Saturday Live Mentor Desk.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          Need assistance? Reply directly or email <a href="mailto:devascentacademy@gmail.com" style="color: #4f46e5;">devascentacademy@gmail.com</a>
        </p>
      </div>
    `;

    return this.dispatchEmail(toEmail, subject, html);
  }

  // ─── Phase 6: Doubt Answered Notification Email ───────────────────────────
  async sendDoubtAnsweredEmail(
    toEmail: string,
    name: string,
    questionText: string,
    answerText: string,
  ): Promise<boolean> {
    const deskUrl = `${process.env.FRONTEND_URL || 'https://dev-ascent-academy.vercel.app'}/support`;
    const subject = `💬 Your Question has been Answered by Mentor - DevAscent Academy`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4f46e5; margin: 0; font-size: 22px; font-weight: 800;">DevAscent Mentor Desk</h2>
          <span style="background: #ecfdf5; color: #059669; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; display: inline-block; margin-top: 6px;">Doubt Resolved ✓</span>
        </div>

        <p style="font-size: 15px; color: #1e293b;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 14px; color: #475569;">
          Instructor <strong>Shivan Mishra</strong> just reviewed and answered your doubt:
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin: 16px 0;">
          <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Your Question</p>
          <p style="margin: 0; font-size: 14px; color: #1e293b; font-style: italic;">"${questionText}"</p>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; color: #15803d; text-transform: uppercase;">Mentor Answer</p>
          <p style="margin: 0; font-size: 14px; color: #14532d; line-height: 1.6; white-space: pre-wrap;">${answerText}</p>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${deskUrl}" style="background: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; padding: 12px 24px; border-radius: 8px; display: inline-block;">
            Open Q&A Help Desk →
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          DevAscent Academy Support • Fast 24/7 Turnaround
        </p>
      </div>
    `;

    return this.dispatchEmail(toEmail, subject, html);
  }

  // ─── Phase 6: Refund Request & Processing Status Email ────────────────────
  async sendRefundStatusEmail(
    toEmail: string,
    name: string,
    orderId: string,
    status: 'REQUESTED' | 'APPROVED' | 'REJECTED',
    amountInRupees?: number,
    note?: string,
  ): Promise<boolean> {
    const isApproved = status === 'APPROVED';
    const isRequested = status === 'REQUESTED';
    const subject = isApproved
      ? `✅ Refund Processed Successfully - DevAscent Academy`
      : isRequested
      ? `📋 Refund Request Received [Order #${orderId}] - DevAscent Academy`
      : `Update regarding your Refund Request [Order #${orderId}]`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 28px 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; color: #1e293b;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4f46e5; margin: 0; font-size: 22px; font-weight: 800;">DevAscent Academy</h2>
          <span style="background: ${isApproved ? '#ecfdf5' : '#fffbeb'}; color: ${isApproved ? '#059669' : '#b45309'}; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; display: inline-block; margin-top: 6px;">
            ${isApproved ? 'Refund Approved & Initiated' : isRequested ? 'Request in Queue' : 'Request Updated'}
          </span>
        </div>

        <p style="font-size: 15px; color: #1e293b;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.6;">
          ${
            isApproved
              ? `Your refund under our 7-Day Money-Back Guarantee for Order <strong>#${orderId}</strong> has been processed. The amount of <strong>₹${(amountInRupees || 1499).toLocaleString('en-IN')}</strong> has been credited to your original payment method / UPI.`
              : isRequested
              ? `We have received your 7-Day Money-Back Guarantee refund request for Order <strong>#${orderId}</strong>. Our finance desk is reviewing your ticket and processing is guaranteed within 24–48 business hours.`
              : `Your refund request for Order <strong>#${orderId}</strong> has been reviewed. Note from desk: ${note || 'Please contact support for further details.'}`
          }
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin: 18px 0; font-size: 13px; color: #64748b;">
          <p style="margin: 0 0 4px 0;"><strong>Order Reference:</strong> <code style="color: #4f46e5;">${orderId}</code></p>
          <p style="margin: 0;"><strong>Turnaround SLA:</strong> Within 24–48 Business Hours</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          If you have any questions, write to <a href="mailto:devascentacademy@gmail.com" style="color: #4f46e5;">devascentacademy@gmail.com</a>
        </p>
      </div>
    `;

    return this.dispatchEmail(toEmail, subject, html);
  }

  // ─── Private Dispatch Helper (Resend HTTP API -> Gmail SMTP Fallback) ─────
  private async dispatchEmail(toEmail: string, subject: string, html: string): Promise<boolean> {
    if (this.resend) {
      try {
        const fromHeader = process.env.RESEND_FROM || 'DevAscent Academy <onboarding@resend.dev>';
        const response = await this.resend.emails.send({
          from: fromHeader,
          to: toEmail,
          subject,
          html,
        });

        if (response.error) {
          this.logger.error(`Resend email error: ${JSON.stringify(response.error)}`);
        } else {
          this.logger.log(`✅ Email delivered to ${toEmail} via Resend HTTP API (${subject})`);
          return true;
        }
      } catch (err: any) {
        this.logger.error(`Failed to dispatch email via Resend: ${err.message}`);
      }
    }

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: this.fromEmail,
          to: toEmail,
          subject,
          html,
        });
        this.logger.log(`✅ Email delivered to ${toEmail} via Gmail SMTP (${subject})`);
        return true;
      } catch (err: any) {
        this.logger.error(`Gmail SMTP send failed: ${err.message}`);
      }
    }

    this.logger.log(`[SIMULATED EMAIL] To: ${toEmail} | Subject: ${subject}`);
    return true;
  }
}

