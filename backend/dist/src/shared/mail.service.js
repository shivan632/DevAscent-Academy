"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    constructor() {
        this.logger = new common_1.Logger(MailService_1.name);
        this.resend = null;
        this.transporter = null;
        this.fromEmail = process.env.EMAIL_FROM || 'DevAscent Academy <shivrom.2020@gmail.com>';
        const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
        const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
        if (smtpUser && smtpPass) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: smtpUser,
                    pass: smtpPass.replace(/\s+/g, ''),
                },
            });
            this.fromEmail = `"DevAscent Academy" <${smtpUser}>`;
            this.logger.log(`📧 Gmail SMTP Mailer initialized for: ${smtpUser}`);
        }
        else {
            const apiKey = process.env.RESEND_API_KEY;
            if (apiKey) {
                this.resend = new resend_1.Resend(apiKey);
                this.logger.log('📧 Resend Mailer initialized.');
            }
            else {
                this.logger.warn('No SMTP or Resend credentials configured. Emails will be logged to console.');
            }
        }
    }
    async sendOtpEmail(toEmail, name, otpCode) {
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
            }
            catch (err) {
                this.logger.error(`Gmail SMTP OTP send failed: ${err.message}`);
            }
        }
        if (this.resend) {
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
            }
            catch (err) {
                this.logger.error(`Failed to send OTP email via Resend: ${err.message}`);
                return false;
            }
        }
        this.logger.log(`[SIMULATED EMAIL] To: ${toEmail} | OTP: ${otpCode}`);
        return true;
    }
    async sendCertificateEmail(toEmail, name, courseTitle, certId, pdfBuffer) {
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
            }
            catch (err) {
                this.logger.error(`Gmail SMTP Certificate send failed: ${err.message}`);
            }
        }
        if (this.resend) {
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
            }
            catch (err) {
                this.logger.error(`Failed to send certificate email via Resend: ${err.message}`);
                return false;
            }
        }
        this.logger.log(`[SIMULATED EMAIL] To: ${toEmail} | Certificate: ${certId} attached (${pdfBuffer.length} bytes)`);
        return true;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map