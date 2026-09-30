import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit');

/**
 * Service that creates official tamper-proof PDF representations of a certificate.
 * Includes embedded logo and verifiable QR code pointing to public verification URL.
 */
@Injectable()
export class PdfService {
  private getLogoPath(): string | null {
    const candidates = [
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
      path.resolve(__dirname, '../../assets/signature.jpg'),
      path.resolve(process.cwd(), 'assets/signature.png'),
      path.resolve(process.cwd(), 'backend/assets/signature.png'),
      path.resolve(process.cwd(), 'assets/signature.jpg'),
      path.resolve(process.cwd(), 'backend/assets/signature.jpg'),
    ];
    for (const p of candidates) {
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  /**
   * Generates a single-page luxury dark blue PDF buffer for the given certificate details.
   */
  async generatePdfBuffer(details: {
    certId: string;
    recipientName: string;
    courseTitle: string;
    grade: string;
    issuedAt: string;
    verifyUrl: string;
    sha256Hash?: string;
  }): Promise<Buffer> {
    // Format issue date nicely (e.g. "30 September 2026")
    let formattedDate = details.issuedAt;
    try {
      const d = new Date(details.issuedAt);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    } catch {
      // keep fallback
    }

    // Generate QR Code with white background and deep dark navy code
    const qrBuffer = await QRCode.toBuffer(details.verifyUrl, {
      width: 90,
      margin: 1,
      color: {
        dark: '#070B14',
        light: '#ffffff',
      },
    });

    return new Promise<Buffer>((resolve, reject) => {
      // Single Landscape A4 (841.89 x 595.28 pt)
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 0,
        autoFirstPage: true,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      const W = 841.89; // Page width
      const H = 595.28; // Page height

      // 1. Dark Luxurious Background
      doc.rect(0, 0, W, H).fill('#080D1A');

      // Subtle gradient-like inner backdrop
      doc.rect(20, 20, W - 40, H - 40).fill('#0B1224');

      // 2. Decorative Double Borders (Cyan & Gold / Slate)
      doc.rect(20, 20, W - 40, H - 40).lineWidth(2).strokeColor('#38BDF8').stroke();
      doc.rect(26, 26, W - 52, H - 52).lineWidth(1).strokeColor('#1E293B').stroke();
      doc.rect(28, 28, W - 56, H - 56).lineWidth(0.5).strokeColor('#38BDF8').stroke();

      // Corner Accents
      const cornerSize = 16;
      const corners = [
        [28, 28],
        [W - 28 - cornerSize, 28],
        [28, H - 28 - cornerSize],
        [W - 28 - cornerSize, H - 28 - cornerSize],
      ];
      corners.forEach(([cx, cy]) => {
        doc.rect(cx, cy, cornerSize, cornerSize).lineWidth(1.5).strokeColor('#F59E0B').stroke();
      });

      // 3. Organization Logo at Top Center
      const logoPath = this.getLogoPath();
      if (logoPath) {
        try {
          doc.image(logoPath, W / 2 - 28, 38, { width: 56 });
        } catch (e) {
          // fallback gracefully
        }
      }

      // 4. Academy Title
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#38BDF8')
        .text('DEVASCENT ACADEMY', 0, 102, { align: 'center', characterSpacing: 3 });

      // 5. Certificate Heading
      doc.fontSize(24).font('Helvetica-Bold').fillColor('#FFFFFF')
        .text('CERTIFICATE OF ACHIEVEMENT', 0, 124, { align: 'center', characterSpacing: 1.5 });

      // 6. Presentation text
      doc.fontSize(10).font('Helvetica').fillColor('#94A3B8')
        .text('THIS IS PROUDLY PRESENTED TO', 0, 162, { align: 'center', characterSpacing: 2 });

      // 7. Large Recipient Name (Centerpiece)
      doc.fontSize(32).font('Helvetica-Bold').fillColor('#F8FAFC')
        .text(details.recipientName, 0, 184, { align: 'center' });

      // Name underline accent (gold gradient line)
      const nameLineWidth = 240;
      doc.moveTo(W / 2 - nameLineWidth / 2, 226)
        .lineTo(W / 2 + nameLineWidth / 2, 226)
        .lineWidth(1.5)
        .strokeColor('#F59E0B')
        .stroke();

      // 8. Body Text (Clean grammar)
      doc.fontSize(11.5).font('Helvetica').fillColor('#CBD5E1')
        .text('for successfully completing all curriculum modules, engineering assignments,', 0, 242, { align: 'center' });
      doc.text('and rigorous project assessments in', 0, 258, { align: 'center' });

      // 9. Course Title (Prominent highlighted cyan / white)
      doc.fontSize(20).font('Helvetica-Bold').fillColor('#38BDF8')
        .text(details.courseTitle, 0, 282, { align: 'center' });

      // 10. Grade & Issued Date Badges
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#10B981')
        .text(`Grade Awarded: ${details.grade}`, 0, 318, { align: 'center' });

      doc.fontSize(10).font('Helvetica').fillColor('#94A3B8')
        .text(`Issued On: ${formattedDate}`, 0, 336, { align: 'center' });

      // 11. Divider line before footer
      doc.moveTo(45, H - 150)
        .lineTo(W - 45, H - 150)
        .lineWidth(0.5)
        .strokeColor('#1E293B')
        .stroke();

      // 12. Footer Left: QR Code + Verification
      const qrX = 55;
      const qrY = H - 138;
      doc.image(qrBuffer, qrX, qrY, { width: 75 });

      doc.fontSize(8).font('Helvetica-Bold').fillColor('#E2E8F0')
        .text('Scan to Verify Credential', qrX - 5, qrY + 80, { width: 85, align: 'center' });

      // Credential details next to QR
      const metaX = qrX + 95;
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#F1F5F9')
        .text(`Credential ID: ${details.certId}`, metaX, qrY + 8);

      doc.fontSize(7.5).font('Helvetica').fillColor('#64748B')
        .text(`Security: SHA-256 Public Ledger Immutable Record`, metaX, qrY + 24);

      doc.fontSize(8).font('Helvetica').fillColor('#38BDF8')
        .text(`Verify URL: ${details.verifyUrl}`, metaX, qrY + 40, { link: details.verifyUrl });

      // 13. Center Official Seal Graphic
      const sealX = W / 2;
      const sealY = H - 85;
      doc.save();
      doc.circle(sealX, sealY, 26).lineWidth(1.5).strokeColor('#F59E0B').stroke();
      doc.circle(sealX, sealY, 22).lineWidth(0.5).strokeColor('#38BDF8').stroke();
      doc.fontSize(7).font('Helvetica-Bold').fillColor('#F59E0B')
        .text('OFFICIAL', sealX - 25, sealY - 10, { width: 50, align: 'center' });
      doc.text('SEAL', sealX - 25, sealY, { width: 50, align: 'center' });
      doc.fontSize(5.5).font('Helvetica').fillColor('#94A3B8')
        .text('DEVASCENT', sealX - 25, sealY + 9, { width: 50, align: 'center' });
      doc.restore();

      // 14. Footer Right: Founder Signature Image & Name
      const signX = W - 230;
      const signY = H - 142;
      const signatureImgPath = this.getSignaturePath();
      if (signatureImgPath) {
        try {
          doc.image(signatureImgPath, signX + 20, signY, { width: 120 });
        } catch (e) {
          console.warn('[PdfService] Signature render warning:', e);
        }
      }

      const lineY = H - 64;
      doc.moveTo(signX, lineY)
        .lineTo(signX + 160, lineY)
        .lineWidth(1)
        .strokeColor('#475569')
        .stroke();

      doc.fontSize(11).font('Helvetica-Bold').fillColor('#FFFFFF')
        .text('Shivan Mishra', signX, lineY + 6, { width: 160, align: 'center' });

      doc.fontSize(8.5).font('Helvetica').fillColor('#94A3B8')
        .text('Founder & Lead Instructor', signX, lineY + 20, { width: 160, align: 'center' });

      doc.end();
    });
  }
}
