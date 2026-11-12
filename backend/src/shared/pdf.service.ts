import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit');

/**
 * Service that creates official tamper-proof PDF representations of a certificate.
 * Produces the official DevAscent Master Ivory & Vintage Gold Filigree certificate.
 */
@Injectable()
export class PdfService {
  private getTemplatePath(): string | null {
    const candidates = [
      path.resolve(__dirname, '../../assets/certificate-template-clean.png'),
      path.resolve(__dirname, '../assets/certificate-template-clean.png'),
      path.resolve(process.cwd(), 'assets/certificate-template-clean.png'),
      path.resolve(process.cwd(), 'backend/assets/certificate-template-clean.png'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  private getLogoPath(): string | null {
    const candidates = [
      path.resolve(__dirname, '../../assets/logo-bkd-removed.png'),
      path.resolve(__dirname, '../assets/logo-bkd-removed.png'),
      path.resolve(process.cwd(), 'assets/logo-bkd-removed.png'),
      path.resolve(process.cwd(), 'backend/assets/logo-bkd-removed.png'),
      path.resolve(__dirname, '../../assets/logo.png'),
      path.resolve(__dirname, '../assets/logo.png'),
      path.resolve(process.cwd(), 'assets/logo.png'),
      path.resolve(process.cwd(), 'backend/assets/logo.png'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  private getSignaturePath(): string | null {
    const candidates = [
      path.resolve(__dirname, '../../assets/signature.png'),
      path.resolve(__dirname, '../assets/signature.png'),
      path.resolve(process.cwd(), 'assets/signature.png'),
      path.resolve(process.cwd(), 'backend/assets/signature.png'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  private getGoldSealPath(): string | null {
    const candidates = [
      path.resolve(__dirname, '../../assets/gold-seal.png'),
      path.resolve(__dirname, '../assets/gold-seal.png'),
      path.resolve(process.cwd(), 'assets/gold-seal.png'),
      path.resolve(process.cwd(), 'backend/assets/gold-seal.png'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  private getMsmeBadgePath(): string | null {
    const candidates = [
      path.resolve(__dirname, '../../assets/msme-badge.png'),
      path.resolve(__dirname, '../assets/msme-badge.png'),
      path.resolve(process.cwd(), 'assets/msme-badge.png'),
      path.resolve(process.cwd(), 'backend/assets/msme-badge.png'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  /**
   * Generates a single-page Master Ivory & Gold Filigree PDF buffer for the certificate.
   */
  async generatePdfBuffer(details: {
    certId: string;
    recipientName: string;
    courseTitle: string;
    grade?: string;
    issuedAt: string;
    verifyUrl: string;
    sha256Hash?: string;
    duration?: string;
    batch?: string;
    startedAt?: string;
    completedAt?: string;
  }): Promise<Buffer> {
    // Format issue / completed date nicely (e.g. "15 March 2026")
    let formattedCompletedDate = details.completedAt || details.issuedAt;
    let formattedStartedDate = details.startedAt || '';
    try {
      const d = new Date(formattedCompletedDate);
      if (!isNaN(d.getTime())) {
        formattedCompletedDate = d.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        // Default start date to 8 weeks prior if not explicitly provided
        if (!formattedStartedDate) {
          const startDateObj = new Date(d.getTime() - 56 * 24 * 60 * 60 * 1000);
          formattedStartedDate = startDateObj.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        }
      }
    } catch {
      // keep fallback
    }

    if (!formattedStartedDate) {
      formattedStartedDate = '15 January 2026';
    }
    if (!formattedCompletedDate) {
      formattedCompletedDate = '15 March 2026';
    }

    const durationText = details.duration || '08 Weeks';
    const verifyUrl = details.verifyUrl
      ? details.verifyUrl.replace('https://www.devascentacademy.me', 'https://dev-ascent-academy.vercel.app')
      : `https://dev-ascent-academy.vercel.app/verify/${details.certId}`;

    // Generate high-contrast QR Code with dark navy and pure white background
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0F172A',
        light: '#ffffff',
      },
    });

    const templatePath = this.getTemplatePath();
    const signaturePath = this.getSignaturePath();
    const logoPath = this.getLogoPath();
    const goldSealPath = this.getGoldSealPath();
    const msmeBadgePath = this.getMsmeBadgePath();

    return new Promise<Buffer>((resolve, reject) => {
      // Single Landscape A4 (841.89 x 595.28 pt)
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 0,
        autoFirstPage: true,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err: Error) => reject(err));

      const W = 841.89; // Page width
      const H = 595.28; // Page height

      if (templatePath && fs.existsSync(templatePath)) {
        // ─── MASTER TEMPLATE RENDER MODE ───
        // Scale factors: master template image is 1024 x 764
        const scaleX = W / 1024;
        const scaleY = H / 764;

        // 1. Draw Master Ivory & Gold Filigree Base Template
        doc.image(templatePath, 0, 0, { width: W, height: H });

        // 2. Dynamic Credential ID in top-left blue badge
        const badgeX = 118 * scaleX;
        const badgeY = 104 * scaleY;
        const badgeW = 127 * scaleX;
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#1E3A8A')
          .text(details.certId, badgeX, badgeY, { width: badgeW, align: 'center', characterSpacing: 0.5 });

        // 3. Dynamic Student Recipient Name (Centerpiece)
        const nameY = 328 * scaleY;
        doc.fontSize(38).font('Times-BoldItalic').fillColor('#0F172A')
          .text(details.recipientName, 0, nameY, { width: W, align: 'center' });

        // 4. Citation Narrative
        const citY = 444 * scaleY;
        doc.fontSize(12).font('Times-Roman').fillColor('#1E293B')
          .text(`for successfully completing an intensive ${durationText} Virtual Internship in`, 0, citY, { width: W, align: 'center' });

        doc.fontSize(14).font('Times-Bold').fillColor('#0F172A')
          .text(`${details.courseTitle} at DevAscent Academy`, 0, citY + 16, { width: W, align: 'center' });

        doc.fontSize(12).font('Times-Roman').fillColor('#1E293B')
          .text(`from ${formattedStartedDate} to ${formattedCompletedDate}.`, 0, citY + 33, { width: W, align: 'center' });

        // 5. Dynamic QR Code in Pillar 1
        const qrX = 136 * scaleX;
        const qrY = 546 * scaleY;
        const qrSize = 108 * scaleX;
        doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });

        // 6. Authentic Signature in Pillar 4
        if (signaturePath && fs.existsSync(signaturePath)) {
          const sigX = 755 * scaleX;
          const sigY = 552 * scaleY;
          const sigW = 145 * scaleX;
          try {
            doc.image(signaturePath, sigX, sigY, { width: sigW });
          } catch (e) {
            console.warn('[PdfService] Signature overlay warning:', e);
          }
        }
      } else {
        // ─── VECTOR FALLBACK RENDER MODE (Ivory & Gold Luxury) ───
        doc.rect(0, 0, W, H).fill('#FCF9F0');

        // Gold Filigree Borders
        doc.rect(14, 14, W - 28, H - 28).lineWidth(1.5).strokeColor('#C5A059').stroke();
        doc.rect(18, 18, W - 36, H - 36).lineWidth(0.8).strokeColor('#E2D1A6').stroke();
        doc.rect(22, 22, W - 44, H - 44).lineWidth(2).strokeColor('#B8860B').stroke();

        // Top Badges
        doc.roundedRect(40, 36, 150, 32, 6).fillAndStroke('#EFF6FF', '#3B82F6');
        doc.fontSize(6).font('Helvetica-Bold').fillColor('#1D4ED8').text('CREDENTIAL ID', 50, 42);
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#1E3A8A').text(details.certId, 50, 52);

        doc.roundedRect(200, 36, 170, 32, 6).fillAndStroke('#ECFDF5', '#10B981');
        doc.fontSize(6).font('Helvetica-Bold').fillColor('#047857').text('MSME: UDYAM-UP-03-0165933', 210, 42);
        doc.fontSize(7.5).font('Helvetica-Bold').fillColor('#065F46').text('SHA-256 VERIFIED LEDGER', 210, 52);

        // Logo Top-Right
        if (logoPath && fs.existsSync(logoPath)) {
          doc.image(logoPath, W - 210, 32, { width: 36 });
        }
        doc.fontSize(13).font('Times-Bold').fillColor('#0F172A').text('DevAscent Academy', W - 165, 34);
        doc.fontSize(7.5).font('Helvetica').fillColor('#64748B').text('Internships & Technical Board', W - 165, 50);

        // Titles
        doc.fontSize(22).font('Times-Bold').fillColor('#0F172A')
          .text('CERTIFICATE OF INTERNSHIP', 0, 105, { align: 'center', characterSpacing: 1.5 });
        doc.fontSize(10).font('Times-Bold').fillColor('#B8860B')
          .text('& TECHNICAL EXCELLENCE', 0, 132, { align: 'center', characterSpacing: 1.2 });

        doc.fontSize(9).font('Times-Roman').fillColor('#64748B')
          .text('This is proudly presented to', 0, 160, { align: 'center' });

        // Student Name
        doc.fontSize(36).font('Times-BoldItalic').fillColor('#0F172A')
          .text(details.recipientName, 0, 185, { align: 'center' });

        // Decorative Flourish Underline
        doc.moveTo(W / 2 - 120, 235).lineTo(W / 2 + 120, 235).lineWidth(1.2).strokeColor('#C5A059').stroke();

        // Citation
        doc.fontSize(12).font('Times-Roman').fillColor('#1E293B')
          .text(`for successfully completing an intensive ${durationText} Virtual Internship in`, 0, 255, { align: 'center' });
        doc.fontSize(14).font('Times-Bold').fillColor('#0F172A')
          .text(`${details.courseTitle} at DevAscent Academy`, 0, 273, { align: 'center' });
        doc.fontSize(12).font('Times-Roman').fillColor('#1E293B')
          .text(`from ${formattedStartedDate} to ${formattedCompletedDate}.`, 0, 292, { align: 'center' });

        // 4 Pillars Footer
        const footY = H - 150;
        // Pillar 1: QR
        doc.rect(70, footY, 68, 68).fill('#FFFFFF');
        doc.image(qrBuffer, 70, footY, { width: 68, height: 68 });
        doc.fontSize(7).font('Helvetica-Bold').fillColor('#0F172A').text('Scan to Verify', 60, footY + 74, { width: 88, align: 'center' });
        doc.fontSize(6).font('Helvetica').fillColor('#64748B').text('Live SHA-256 Ledger', 60, footY + 84, { width: 88, align: 'center' });

        // Pillar 2: Gold Seal
        if (goldSealPath && fs.existsSync(goldSealPath)) {
          doc.image(goldSealPath, W * 0.38 - 35, footY, { width: 70 });
        }

        // Pillar 3: MSME
        if (msmeBadgePath && fs.existsSync(msmeBadgePath)) {
          doc.image(msmeBadgePath, W * 0.62 - 35, footY, { width: 70 });
        }

        // Pillar 4: Signature
        if (signaturePath && fs.existsSync(signaturePath)) {
          doc.image(signaturePath, W - 180, footY + 5, { width: 110 });
        }
        doc.moveTo(W - 190, footY + 55).lineTo(W - 60, footY + 55).lineWidth(1).strokeColor('#94A3B8').stroke();
        doc.fontSize(9.5).font('Times-Bold').fillColor('#0F172A').text('Shivan Mishra', W - 190, footY + 60, { width: 130, align: 'center' });
        doc.fontSize(7).font('Helvetica').fillColor('#64748B').text('Founder & Director, DevAscent Academy', W - 190, footY + 73, { width: 130, align: 'center' });
      }

      doc.end();
    });
  }
}
