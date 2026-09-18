import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';

/**
 * Service that creates official tamper-proof PDF representations of a certificate.
 * Includes embedded logo and verifiable QR code pointing to public verification URL.
 */
@Injectable()
export class PdfService {
  private logoPath = path.resolve(__dirname, '../../../assets/logo.png');

  /**
   * Generates a PDF buffer for the given certificate details.
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
    // Generate QR Code Buffer
    const qrBuffer = await QRCode.toBuffer(details.verifyUrl, {
      width: 110,
      margin: 1,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    });

    return new Promise<Buffer>((resolve, reject) => {
      // Landscape A4 for classic premium certificate layout
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 40,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      const width = doc.page.width;
      const height = doc.page.height;

      // Decorative double border
      doc.rect(20, 20, width - 40, height - 40).lineWidth(3).strokeColor('#4f46e5').stroke();
      doc.rect(26, 26, width - 52, height - 52).lineWidth(1).strokeColor('#c7d2fe').stroke();

      // Top corner badge accents
      doc.save();
      doc.fillColor('#e0e7ff').circle(30, 30, 8).fill();
      doc.fillColor('#e0e7ff').circle(width - 30, 30, 8).fill();
      doc.fillColor('#e0e7ff').circle(30, height - 30, 8).fill();
      doc.fillColor('#e0e7ff').circle(width - 30, height - 30, 8).fill();
      doc.restore();

      // Organization Logo (if exists)
      if (fs.existsSync(this.logoPath)) {
        try {
          doc.image(this.logoPath, width / 2 - 35, 42, { width: 70 });
        } catch (e) {
          // fallback gracefully
        }
      }

      // Title & Academy Name
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#6366f1').text('DEVASCENT ACADEMY', 0, 120, { align: 'center', characterSpacing: 2 });
      doc.fontSize(28).font('Helvetica-Bold').fillColor('#0f172a').text('CERTIFICATE OF ACHIEVEMENT', 0, 142, { align: 'center', characterSpacing: 1 });

      // Subtitle
      doc.fontSize(12).font('Helvetica').fillColor('#64748b').text('THIS IS PROUDLY PRESENTED TO', 0, 185, { align: 'center', characterSpacing: 1.5 });

      // Recipient Name
      doc.fontSize(28).font('Helvetica-Bold').fillColor('#1e1b4b').text(details.recipientName, 0, 210, { align: 'center' });

      // Description text
      doc.fontSize(13).font('Helvetica').fillColor('#334155').text('for successfully completing all curriculum modules, engineering assignments, and', 0, 255, { align: 'center' });
      doc.text('rigorous project assessments with distinction in', 0, 273, { align: 'center' });

      // Course Title
      doc.fontSize(20).font('Helvetica-Bold').fillColor('#4338ca').text(details.courseTitle, 0, 298, { align: 'center' });

      // Grade & Issued Date
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#059669').text(`Grade Awarded: ${details.grade}`, 0, 332, { align: 'center' });
      doc.fontSize(11).font('Helvetica').fillColor('#64748b').text(`Issued Date: ${details.issuedAt}`, 0, 350, { align: 'center' });

      // Footer - QR Code and Verification info
      doc.image(qrBuffer, 55, height - 150, { width: 85 });
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#1e293b').text('Scan to Verify Credential', 50, height - 60, { width: 95, align: 'center' });

      // Tamper-proof Cert ID and Hash
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e1b4b').text(`Credential ID: ${details.certId}`, 160, height - 110);
      if (details.sha256Hash) {
        doc.fontSize(8).font('Courier').fillColor('#64748b').text(`Fingerprint: ${details.sha256Hash.substring(0, 32)}...`, 160, height - 94);
      }
      doc.fontSize(9).font('Helvetica').fillColor('#4f46e5').text(`Verify: ${details.verifyUrl}`, 160, height - 78, { link: details.verifyUrl });

      // Director Signatory
      const signX = width - 220;
      doc.moveTo(signX, height - 80).lineTo(signX + 160, height - 80).lineWidth(1).strokeColor('#94a3b8').stroke();
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('Shivan Mishra', signX, height - 74, { width: 160, align: 'center' });
      doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Founder & Lead Instructor', signX, height - 58, { width: 160, align: 'center' });

      doc.end();
    });
  }
}
