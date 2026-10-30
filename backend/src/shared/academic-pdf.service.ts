import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as QRCode from 'qrcode';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit');

export interface OfferLetterDetails {
  docId: string;
  recipientName: string;
  courseTitle: string;
  durationWeeks: number;
  issuedAt: string;
  verifyUrl: string;
  sha256Hash: string;
  cohortNumber?: number;
  stipendDetails?: string;
  college?: string;
  degree?: string;
}

export interface LorDetails {
  docId: string;
  recipientName: string;
  courseTitle: string;
  grade?: string;
  issuedAt: string;
  verifyUrl: string;
  sha256Hash: string;
  durationWeeks?: number;
  college?: string;
  capstoneTitle?: string;
}

@Injectable()
export class AcademicPdfService {
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
   * Generates a formal, high-res vector A4 Internship Offer Letter.
   */
  async generateOfferLetterBuffer(details: OfferLetterDetails): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 45,
          info: {
            Title: `DevAscent Internship Offer Letter - ${details.recipientName}`,
            Author: 'DevAscent Academy',
            Subject: 'Official Internship Appointment Letter',
            Keywords: 'Internship, Offer Letter, DevAscent, Software Engineering',
          },
        });

        const buffers: Buffer[] = [];
        doc.on('data', (chunk: Buffer) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err: any) => reject(err));

        const logoPath = this.getLogoPath();
        const signaturePath = this.getSignaturePath();
        const qrBuffer = await QRCode.toBuffer(details.verifyUrl, {
          width: 110,
          margin: 1,
          color: { dark: '#0F172A', light: '#FFFFFF' },
        });

        const pageWidth = 595.28;
        const pageHeight = 841.89;
        const margin = 45;
        const contentWidth = pageWidth - margin * 2;

        // Top Header Accent Line
        doc.rect(0, 0, pageWidth, 6).fill('#4F46E5');

        // Header Section
        let cursorY = 32;
        if (logoPath) {
          doc.image(logoPath, margin, cursorY, { width: 44, height: 44 });
        }

        // Company Details Right-Aligned
        doc
          .font('Helvetica-Bold')
          .fontSize(16)
          .fillColor('#0F172A')
          .text('DEVASCENT ACADEMY', margin + 54, cursorY + 2);

        doc
          .font('Helvetica')
          .fontSize(8.5)
          .fillColor('#64748B')
          .text('Production Software Engineering Ecosystem & Virtual Internships', margin + 54, cursorY + 20)
          .text('Bengaluru, Karnataka, India  |  verify: devascentacademy.me/verify', margin + 54, cursorY + 31);

        // Divider
        cursorY = 85;
        doc
          .strokeColor('#E2E8F0')
          .lineWidth(1)
          .moveTo(margin, cursorY)
          .lineTo(pageWidth - margin, cursorY)
          .stroke();

        // Meta Bar (Date, Ref No)
        cursorY += 12;
        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor('#475569')
          .text(`REF NO: ${details.docId}`, margin, cursorY)
          .font('Helvetica')
          .text(`DATE OF ISSUE: ${details.issuedAt}`, margin, cursorY, { align: 'right', width: contentWidth });

        // Recipient Address
        cursorY += 26;
        doc
          .font('Helvetica-Bold')
          .fontSize(10)
          .fillColor('#0F172A')
          .text('TO,', margin, cursorY);

        cursorY += 14;
        doc
          .font('Helvetica-Bold')
          .fontSize(12)
          .fillColor('#1E293B')
          .text(details.recipientName.toUpperCase(), margin, cursorY);

        cursorY += 16;
        if (details.college || details.degree) {
          doc
            .font('Helvetica')
            .fontSize(9)
            .fillColor('#64748B')
            .text(`${details.degree || 'Engineering Candidate'}, ${details.college || 'Partner Institution'}`, margin, cursorY);
          cursorY += 14;
        }

        // Subject
        cursorY += 6;
        doc
          .rect(margin, cursorY, contentWidth, 24)
          .fill('#F1F5F9');

        doc
          .font('Helvetica-Bold')
          .fontSize(10)
          .fillColor('#1E293B')
          .text(
            `SUBJECT: FORMAL APPOINTMENT LETTER FOR VIRTUAL INTERNSHIP IN ${details.courseTitle.toUpperCase()}`,
            margin + 10,
            cursorY + 7,
            { width: contentWidth - 20 }
          );

        // Salutation
        cursorY += 34;
        doc
          .font('Helvetica')
          .fontSize(9.5)
          .fillColor('#334155')
          .text(`Dear ${details.recipientName},`, margin, cursorY);

        cursorY += 16;
        const p1 = `On behalf of DevAscent Academy, we are delighted to offer you a virtual internship appointment as a Software Engineering Intern in our ${details.courseTitle} program (Cohort #${details.cohortNumber || 14}). We were impressed by your passion for software architecture, systems engineering, and modern development practices.`;
        doc
          .font('Helvetica')
          .fontSize(9.5)
          .fillColor('#334155')
          .text(p1, margin, cursorY, { width: contentWidth, align: 'justify', lineGap: 3.5 });

        cursorY += 46;
        const p2 = `During this ${details.durationWeeks || 4}-week tenure, you will work on production capstone codebases, perform git branching workflows, and undergo architectural pull request reviews. Your internship is structured around verifiable proof-of-work to bridge the gap between academic textbooks and industry-grade engineering standards.`;
        doc
          .font('Helvetica')
          .fontSize(9.5)
          .fillColor('#334155')
          .text(p2, margin, cursorY, { width: contentWidth, align: 'justify', lineGap: 3.5 });

        // Terms Table Box
        cursorY += 48;
        doc
          .rect(margin, cursorY, contentWidth, 90)
          .fillAndStroke('#F8FAFC', '#E2E8F0');

        const col1 = margin + 14;
        const col2 = margin + 260;
        let tY = cursorY + 12;

        const addRow = (label: string, value: string, xPos: number, yPos: number) => {
          doc
            .font('Helvetica-Bold')
            .fontSize(8.5)
            .fillColor('#64748B')
            .text(label.toUpperCase(), xPos, yPos)
            .font('Helvetica-Bold')
            .fontSize(9.5)
            .fillColor('#0F172A')
            .text(value, xPos, yPos + 11);
        };

        addRow('Track / Specialization', details.courseTitle, col1, tY);
        addRow('Program Duration', `${details.durationWeeks || 4} Weeks (Milestone Gated)`, col2, tY);

        tY += 36;
        addRow('Mentorship', 'Direct PR Reviews & Architecture Guidance', col1, tY);
        addRow('Completion Credential', 'Verifiable SHA-256 Ledger Certificate & LOR', col2, tY);

        // Performance & Verification paragraph
        cursorY += 104;
        const p3 = `Upon satisfactory milestone completions and public GitHub capstone submission, you will be awarded an industry-verifiable cryptographic certificate along with an official Letter of Recommendation (LOR) for academic credit submission.`;
        doc
          .font('Helvetica')
          .fontSize(9.5)
          .fillColor('#334155')
          .text(p3, margin, cursorY, { width: contentWidth, align: 'justify', lineGap: 3 });

        // Signature & QR Section at Bottom
        cursorY = pageHeight - 160;

        // Founder Signature Block
        if (signaturePath) {
          doc.image(signaturePath, margin, cursorY - 14, { width: 95 });
        }
        doc
          .font('Helvetica-Bold')
          .fontSize(10.5)
          .fillColor('#0F172A')
          .text('Shivan Mishra', margin, cursorY + 34)
          .font('Helvetica-Bold')
          .fontSize(8.5)
          .fillColor('#4F46E5')
          .text('Founder & Principal Systems Architect', margin, cursorY + 47)
          .font('Helvetica')
          .fontSize(8)
          .fillColor('#64748B')
          .text('DevAscent Academy • Bengaluru, India', margin, cursorY + 59);

        // QR Code Box Right Aligned
        const qrSize = 65;
        const qrX = pageWidth - margin - qrSize - 8;
        doc.image(qrBuffer, qrX, cursorY + 2, { width: qrSize, height: qrSize });
        doc
          .font('Helvetica-Bold')
          .fontSize(7)
          .fillColor('#64748B')
          .text('SCAN TO VERIFY DOC', qrX - 10, cursorY + qrSize + 6, { width: qrSize + 20, align: 'center' });

        // Bottom Security Hash Bar
        const footerY = pageHeight - 34;
        doc
          .rect(0, footerY - 8, pageWidth, 42)
          .fill('#0F172A');

        doc
          .font('Helvetica-Bold')
          .fontSize(7)
          .fillColor('#818CF8')
          .text(`TAMPER-PROOF LEDGER SEAL: ${details.sha256Hash}`, margin, footerY - 2)
          .font('Helvetica')
          .fontSize(6.5)
          .fillColor('#94A3B8')
          .text(`Public Registry Verification: ${details.verifyUrl}`, margin, footerY + 8);

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Generates a formal Letter of Recommendation (LOR) on official DevAscent letterhead.
   */
  async generateLorBuffer(details: LorDetails): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 45,
          info: {
            Title: `DevAscent Letter of Recommendation - ${details.recipientName}`,
            Author: 'DevAscent Academy',
            Subject: 'Academic & Professional Recommendation Letter',
            Keywords: 'LOR, Recommendation, DevAscent, Capstone Review',
          },
        });

        const buffers: Buffer[] = [];
        doc.on('data', (chunk: Buffer) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err: any) => reject(err));

        const logoPath = this.getLogoPath();
        const signaturePath = this.getSignaturePath();
        const qrBuffer = await QRCode.toBuffer(details.verifyUrl, {
          width: 110,
          margin: 1,
          color: { dark: '#0F172A', light: '#FFFFFF' },
        });

        const pageWidth = 595.28;
        const pageHeight = 841.89;
        const margin = 45;
        const contentWidth = pageWidth - margin * 2;

        // Top Gold/Emerald Accent Line for Distinction
        doc.rect(0, 0, pageWidth, 6).fill('#059669');

        // Header Section
        let cursorY = 32;
        if (logoPath) {
          doc.image(logoPath, margin, cursorY, { width: 44, height: 44 });
        }

        doc
          .font('Helvetica-Bold')
          .fontSize(16)
          .fillColor('#0F172A')
          .text('DEVASCENT ACADEMY', margin + 54, cursorY + 2);

        doc
          .font('Helvetica')
          .fontSize(8.5)
          .fillColor('#64748B')
          .text('Office of Academic & Technical Mentorship  |  Bengaluru, India', margin + 54, cursorY + 20)
          .text('Official Letter of Recommendation (LOR)  |  verify: devascentacademy.me/verify', margin + 54, cursorY + 31);

        // Divider
        cursorY = 85;
        doc
          .strokeColor('#E2E8F0')
          .lineWidth(1)
          .moveTo(margin, cursorY)
          .lineTo(pageWidth - margin, cursorY)
          .stroke();

        // Meta Bar
        cursorY += 12;
        doc
          .font('Helvetica-Bold')
          .fontSize(9)
          .fillColor('#475569')
          .text(`LOR ID: ${details.docId}`, margin, cursorY)
          .font('Helvetica')
          .text(`DATE: ${details.issuedAt}`, margin, cursorY, { align: 'right', width: contentWidth });

        // Addressee
        cursorY += 26;
        doc
          .font('Helvetica-Bold')
          .fontSize(11)
          .fillColor('#0F172A')
          .text('TO WHOMSOEVER IT MAY CONCERN,', margin, cursorY);

        cursorY += 20;
        const p1 = `It is my distinct pleasure to write this Letter of Recommendation for ${details.recipientName}, who successfully completed the rigorous ${details.durationWeeks || 4}-week ${details.courseTitle} internship program at DevAscent Academy, graduating with a distinguished academic standing (${details.grade || 'Grade A+ / Distinction'}).`;
        doc
          .font('Helvetica')
          .fontSize(9.5)
          .fillColor('#334155')
          .text(p1, margin, cursorY, { width: contentWidth, align: 'justify', lineGap: 3.5 });

        cursorY += 48;
        const p2 = `Unlike conventional academic courses that focus on passive rote learning, DevAscent Academy evaluates students strictly on production-grade engineering merits: architectural decomposition, git commit cleanliness, test coverage, and clean modular code. Throughout their tenure, ${details.recipientName} consistently demonstrated outstanding problem-solving grit, technical curiosity, and adherence to production best practices.`;
        doc
          .font('Helvetica')
          .fontSize(9.5)
          .fillColor('#334155')
          .text(p2, margin, cursorY, { width: contentWidth, align: 'justify', lineGap: 3.5 });

        cursorY += 58;
        const p3 = `During the capstone evaluation phase (${details.capstoneTitle || 'Real-World Production System'}), ${details.recipientName} engineered a fully functional, architecturally sound solution that passed our mentor code reviews. Their ability to debug edge cases, write maintainable documentation, and grasp complex software principles sets them significantly apart from typical fresh graduates.`;
        doc
          .font('Helvetica')
          .fontSize(9.5)
          .fillColor('#334155')
          .text(p3, margin, cursorY, { width: contentWidth, align: 'justify', lineGap: 3.5 });

        cursorY += 54;
        const p4 = `I have absolute confidence in ${details.recipientName}'s technical potential and recommend them without reservation for software engineering roles, technical internships, and higher academic programs. They will be a high-impact engineering asset to any technical team.`;
        doc
          .font('Helvetica')
          .fontSize(9.5)
          .fillColor('#334155')
          .text(p4, margin, cursorY, { width: contentWidth, align: 'justify', lineGap: 3.5 });

        // Signature & QR
        cursorY = pageHeight - 160;

        if (signaturePath) {
          doc.image(signaturePath, margin, cursorY - 14, { width: 95 });
        }
        doc
          .font('Helvetica-Bold')
          .fontSize(10.5)
          .fillColor('#0F172A')
          .text('Shivan Mishra', margin, cursorY + 34)
          .font('Helvetica-Bold')
          .fontSize(8.5)
          .fillColor('#059669')
          .text('Founder & Principal Systems Architect', margin, cursorY + 47)
          .font('Helvetica')
          .fontSize(8)
          .fillColor('#64748B')
          .text('DevAscent Academy • Bengaluru, India  |  founder@devascentacademy.me', margin, cursorY + 59);

        const qrSize = 65;
        const qrX = pageWidth - margin - qrSize - 8;
        doc.image(qrBuffer, qrX, cursorY + 2, { width: qrSize, height: qrSize });
        doc
          .font('Helvetica-Bold')
          .fontSize(7)
          .fillColor('#64748B')
          .text('SCAN TO VERIFY LOR', qrX - 10, cursorY + qrSize + 6, { width: qrSize + 20, align: 'center' });

        // Bottom Hash Bar
        const footerY = pageHeight - 34;
        doc
          .rect(0, footerY - 8, pageWidth, 42)
          .fill('#064E3B');

        doc
          .font('Helvetica-Bold')
          .fontSize(7)
          .fillColor('#A7F3D0')
          .text(`VERIFIABLE LOR SEAL: ${details.sha256Hash}`, margin, footerY - 2)
          .font('Helvetica')
          .fontSize(6.5)
          .fillColor('#D1FAE5')
          .text(`Public Registry Record: ${details.verifyUrl}`, margin, footerY + 8);

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}

