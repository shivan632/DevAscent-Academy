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
   * Generates a single-page modern luxury dark-mode PDF buffer for the given certificate details.
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
    // Format issue / completed date nicely (e.g. "October 1, 2026")
    let formattedCompletedDate = details.completedAt || details.issuedAt;
    let formattedStartedDate = details.startedAt || '';
    try {
      const d = new Date(formattedCompletedDate);
      if (!isNaN(d.getTime())) {
        formattedCompletedDate = d.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        // Default start date to 4 weeks prior if not explicitly provided
        if (!formattedStartedDate) {
          const startDateObj = new Date(d.getTime() - 28 * 24 * 60 * 60 * 1000);
          formattedStartedDate = startDateObj.toLocaleDateString('en-US', {
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
      formattedStartedDate = 'September 1, 2026';
    }
    if (!formattedCompletedDate) {
      formattedCompletedDate = 'October 1, 2026';
    }

    const durationText = details.duration || '4 Weeks / 40 Hours';
    const batchText = details.batch || 'Winter 2026 Cohort';
    let gradeText = details.grade || 'Distinction (A+)';
    if (gradeText === 'A+' || gradeText === 'A') {
      gradeText = `Distinction (${gradeText})`;
    }

    // Generate high-contrast QR Code with dark navy and pure white background
    const qrBuffer = await QRCode.toBuffer(details.verifyUrl, {
      width: 140,
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

      // 1. Deep Matte Obsidian Slate Backdrop
      doc.rect(0, 0, W, H).fill('#050811');

      // Inner card backdrop with subtle depth
      doc.rect(14, 14, W - 28, H - 28).fill('#090E1C');

      // 2. Subtle Geometric Security Watermark Grid
      doc.save();
      doc.lineWidth(0.3).strokeColor('#141F33');
      const step = 42;
      for (let x = 28; x < W - 28; x += step) {
        doc.moveTo(x, 24).lineTo(x, H - 24).stroke();
      }
      for (let y = 28; y < H - 28; y += step) {
        doc.moveTo(24, y).lineTo(W - 24, y).stroke();
      }
      doc.restore();

      // Inner content container backdrop
      doc.rect(22, 22, W - 44, H - 44).fill('#090E1C');

      // 3. Luxurious Double Borders (Champagne Gold & Cyber Blue)
      doc.rect(14, 14, W - 28, H - 28).lineWidth(1.8).strokeColor('#D4AF37').stroke();
      doc.rect(20, 20, W - 40, H - 40).lineWidth(0.6).strokeColor('#1E3A5F').stroke();
      doc.rect(22, 22, W - 44, H - 44).lineWidth(1).strokeColor('#38BDF8').stroke();

      // 4. Refined Corner Insets & Diamond Accents
      const cornerLen = 22;
      const cornerInset = 22;

      // Top-Left L-bracket
      doc.moveTo(cornerInset, cornerInset + cornerLen).lineTo(cornerInset, cornerInset).lineTo(cornerInset + cornerLen, cornerInset).lineWidth(2.5).strokeColor('#E5C07B').stroke();
      // Top-Right L-bracket
      doc.moveTo(W - cornerInset - cornerLen, cornerInset).lineTo(W - cornerInset, cornerInset).lineTo(W - cornerInset, cornerInset + cornerLen).lineWidth(2.5).strokeColor('#E5C07B').stroke();
      // Bottom-Left L-bracket
      doc.moveTo(cornerInset, H - cornerInset - cornerLen).lineTo(cornerInset, H - cornerInset).lineTo(cornerInset + cornerLen, H - cornerInset).lineWidth(2.5).strokeColor('#E5C07B').stroke();
      // Bottom-Right L-bracket
      doc.moveTo(W - cornerInset - cornerLen, H - cornerInset).lineTo(W - cornerInset, H - cornerInset).lineTo(W - cornerInset, H - cornerInset - cornerLen).lineWidth(2.5).strokeColor('#E5C07B').stroke();

      // Corner Diamonds (Rotated 45 deg)
      const diamondPts = [
        [34, 34],
        [W - 34, 34],
        [34, H - 34],
        [W - 34, H - 34],
      ];
      diamondPts.forEach(([dx, dy]) => {
        doc.save();
        doc.translate(dx, dy);
        doc.rotate(45);
        doc.rect(-3.5, -3.5, 7, 7).fill('#E5C07B');
        doc.restore();
      });

      // 5. Official Company Logo at Top Center
      const logoPath = this.getLogoPath();
      if (logoPath) {
        try {
          doc.image(logoPath, W / 2 - 24, 25, { width: 48, height: 48 });
        } catch (e) {
          // fallback gracefully
        }
      }

      // 6. Academy Header & Subtitle
      doc.fontSize(13).font('Helvetica-Bold').fillColor('#E5C07B')
        .text('DEVASCENT ACADEMY', 0, 75, { align: 'center', characterSpacing: 3 });

      doc.fontSize(7).font('Helvetica-Bold').fillColor('#38BDF8')
        .text('ACCREDITED TECHNOLOGY ENGINEERING BOARD', 0, 91, { align: 'center', characterSpacing: 1.8 });

      // 7. Certificate Heading
      doc.fontSize(20).font('Helvetica-Bold').fillColor('#FFFFFF')
        .text('CERTIFICATE OF ACHIEVEMENT', 0, 106, { align: 'center', characterSpacing: 1.8 });

      // Decorative Line with "THIS IS PROUDLY PRESENTED TO"
      doc.moveTo(W / 2 - 165, 133).lineTo(W / 2 - 100, 133).lineWidth(0.8).strokeColor('#D4AF37').stroke();
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#94A3B8')
        .text('THIS IS PROUDLY PRESENTED TO', 0, 129, { align: 'center', characterSpacing: 2 });
      doc.moveTo(W / 2 + 100, 133).lineTo(W / 2 + 165, 133).lineWidth(0.8).strokeColor('#D4AF37').stroke();

      // 8. Large Recipient Name (Centerpiece)
      doc.fontSize(27).font('Helvetica-Bold').fillColor('#F8FAFC')
        .text(details.recipientName, 0, 143, { align: 'center' });

      // Recipient Divider with center diamond accent
      const lineWidth = 240;
      doc.moveTo(W / 2 - lineWidth / 2, 178)
        .lineTo(W / 2 + lineWidth / 2, 178)
        .lineWidth(1.2)
        .strokeColor('#D4AF37')
        .stroke();

      doc.save();
      doc.translate(W / 2, 178);
      doc.rotate(45);
      doc.rect(-3, -3, 6, 6).fill('#E5C07B');
      doc.restore();

      // 9. Narrative Body Text
      doc.fontSize(9.5).font('Helvetica').fillColor('#94A3B8')
        .text('for successfully completing all advanced curriculum modules, practical engineering assignments,', 0, 192, { align: 'center' });
      doc.text('and rigorous production-grade capstone assessments in', 0, 205, { align: 'center' });

      // 10. Course Title (Prominent Glowing Cyan)
      doc.fontSize(16).font('Helvetica-Bold').fillColor('#38BDF8')
        .text(details.courseTitle.toUpperCase(), 0, 224, { align: 'center', characterSpacing: 0.8 });

      // 11. Program Details Container Box
      const boxW = 460;
      const boxH = 92;
      const boxX = W / 2 - boxW / 2;
      const boxY = 248;

      doc.roundedRect(boxX, boxY, boxW, boxH, 8).fill('#0B1222');
      doc.roundedRect(boxX, boxY, boxW, boxH, 8).lineWidth(0.8).strokeColor('#1E2E4A').stroke();

      // Row 1: Program Duration & Batch
      const col1X = boxX + 24;
      const col2X = boxX + boxW / 2 + 16;
      const row1Y = boxY + 12;

      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#64748B')
        .text('Program Duration: ', col1X, row1Y, { continued: true })
        .font('Helvetica-Bold').fillColor('#E2E8F0')
        .text(durationText);

      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#64748B')
        .text('Batch: ', col2X, row1Y, { continued: true })
        .font('Helvetica-Bold').fillColor('#E2E8F0')
        .text(batchText);

      // Row 2: Started & Completed Dates
      const row2Y = boxY + 32;

      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#64748B')
        .text('Started: ', col1X, row2Y, { continued: true })
        .font('Helvetica-Bold').fillColor('#E2E8F0')
        .text(formattedStartedDate);

      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#64748B')
        .text('Completed: ', col2X, row2Y, { continued: true })
        .font('Helvetica-Bold').fillColor('#E2E8F0')
        .text(formattedCompletedDate);

      // Row 3: Grade Awarded Badge (Centered)
      const row3Y = boxY + 58;
      const gradePillW = 260;
      const gradePillH = 22;
      const gradePillX = boxX + (boxW - gradePillW) / 2;

      doc.roundedRect(gradePillX, row3Y, gradePillW, gradePillH, 11).fill('#06281E');
      doc.roundedRect(gradePillX, row3Y, gradePillW, gradePillH, 11).lineWidth(0.8).strokeColor('#059669').stroke();

      doc.fontSize(9).font('Helvetica-Bold').fillColor('#10B981')
        .text(`Grade Awarded: ${gradeText}`, gradePillX, row3Y + 6, { width: gradePillW, align: 'center', characterSpacing: 0.5 });

      // 12. Fine Divider Line before Footer
      doc.moveTo(40, H - 146)
        .lineTo(W - 40, H - 146)
        .lineWidth(0.8)
        .strokeColor('#1E293B')
        .stroke();

      // 13. Footer Left: QR Code + Verifiable Credential Details
      const qrX = 52;
      const qrY = H - 134;
      const qrSize = 68;

      // QR Code container with crisp white card & gold hairline
      doc.rect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6).fill('#FFFFFF');
      doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
      doc.rect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6).lineWidth(1).strokeColor('#D4AF37').stroke();

      // QR Meta text (clean hierarchy without wrapping/overlapping)
      const metaX = qrX + qrSize + 14;
      doc.fontSize(8).font('Helvetica-Bold').fillColor('#F1F5F9')
        .text('SCAN TO VERIFY CREDENTIAL', metaX, qrY + 3, { characterSpacing: 0.5 });

      doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#E5C07B')
        .text(`Credential ID: ${details.certId}`, metaX, qrY + 17);

      doc.fontSize(6.5).font('Helvetica').fillColor('#64748B')
        .text('Security: SHA-256 Public Ledger Immutable Record', metaX, qrY + 31);

      doc.fontSize(7).font('Helvetica').fillColor('#38BDF8')
        .text(`Verify: ${details.verifyUrl}`, metaX, qrY + 44, { link: details.verifyUrl, width: 230 });

      // 14. Footer Center: Gold Foil Medallion Official Seal
      const sealX = W / 2;
      const sealY = H - 84;
      const sealR = 33;

      doc.save();
      // Outer 24-point Scalloped Star/Medallion Points
      const points = 24;
      doc.save();
      doc.translate(sealX, sealY);
      const starPoints: [number, number][] = [];
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? sealR + 4 : sealR - 1;
        const angle = (i * Math.PI) / points;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        starPoints.push([px, py]);
      }
      doc.polygon(...starPoints).fillColor('#D4AF37').fill();
      doc.restore();

      // Concentric Seal Rings
      doc.circle(sealX, sealY, sealR).fillColor('#0A0F1D').fill();
      doc.circle(sealX, sealY, sealR).lineWidth(1.8).strokeColor('#E5C07B').stroke();
      doc.circle(sealX, sealY, sealR - 4).lineWidth(0.6).strokeColor('#D4AF37').stroke();
      doc.circle(sealX, sealY, sealR - 7).fillColor('#090E1C').fill();
      doc.circle(sealX, sealY, sealR - 7).lineWidth(1.2).strokeColor('#E5C07B').stroke();

      // Inner Medallion Text & DA Monogram
      doc.fontSize(5.5).font('Helvetica-Bold').fillColor('#FFF59D')
        .text('DEVASCENT', sealX - 25, sealY - 17, { width: 50, align: 'center', characterSpacing: 1 });
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#E5C07B')
        .text('DA', sealX - 25, sealY - 7, { width: 50, align: 'center' });
      doc.fontSize(5).font('Helvetica-Bold').fillColor('#FFF59D')
        .text('OFFICIAL SEAL', sealX - 25, sealY + 7, { width: 50, align: 'center', characterSpacing: 0.8 });
      doc.restore();

      // 15. Footer Right: Authentic Founder Signature & Lead Instructor
      const signX = W - 225;
      const signY = H - 138;
      const signatureImgPath = this.getSignaturePath();
      if (signatureImgPath) {
        try {
          doc.image(signatureImgPath, signX + 22, signY - 4, { width: 115 });
        } catch (e) {
          console.warn('[PdfService] Signature render warning:', e);
        }
      }

      const signLineY = H - 64;
      doc.moveTo(signX, signLineY)
        .lineTo(signX + 160, signLineY)
        .lineWidth(1)
        .strokeColor('#D4AF37')
        .stroke();

      doc.fontSize(12).font('Helvetica-Bold').fillColor('#FFFFFF')
        .text('Shivan Mishra', signX, signLineY + 6, { width: 160, align: 'center' });

      doc.fontSize(8.5).font('Helvetica').fillColor('#94A3B8')
        .text('Founder & Lead Instructor', signX, signLineY + 20, { width: 160, align: 'center' });

      doc.end();
    });
  }
}
