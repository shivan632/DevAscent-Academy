import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { PdfService } from '../../shared/pdf.service';
import { MailService } from '../../shared/mail.service';

@Injectable()
export class CertificatesService {
  constructor(
    private prisma: PrismaService,
    private pdfService: PdfService,
    private mailService: MailService,
  ) {}

  generateCertId(): string {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `DEV-${year}-${randomHex}`;
  }

  computeHash(certId: string, name: string, courseTitle: string, issuedAt: string): string {
    const rawPayload = `${certId}:${name}:${courseTitle}:DevAscent Academy:${issuedAt}`;
    return crypto.createHash('sha256').update(rawPayload).digest('hex');
  }

  /**
   * Internal/Admin issue of certificate upon submission approval.
   * Creates record, generates PDF with verifiable QR code, and emails PDF to recipient.
   */
  async issueAndEmailCertificate(userId: string, courseId: string, grade = 'Distinction (A+)') {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });

    if (!user || !course) {
      throw new NotFoundException('User or Course not found');
    }

    // Check existing certificate
    let certificate = await this.prisma.certificate.findFirst({
      where: { userId, courseId },
    });

    const issuedAtDate = certificate ? certificate.issuedAt : new Date();
    const issuedAtStr = issuedAtDate.toISOString().split('T')[0];

    if (!certificate) {
      const certId = this.generateCertId();
      const sha256Hash = this.computeHash(certId, user.name, course.title, issuedAtStr);

      certificate = await this.prisma.certificate.create({
        data: {
          certId,
          userId,
          courseId,
          recipientName: user.name,
          courseTitle: course.title,
          sha256Hash,
          grade,
          issuedAt: issuedAtDate,
        },
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verifyUrl = `${frontendUrl}/verify/${certificate.certId}`;

    // Generate tamper-proof PDF with QR code
    const pdfBuffer = await this.pdfService.generatePdfBuffer({
      certId: certificate.certId,
      recipientName: certificate.recipientName,
      courseTitle: certificate.courseTitle,
      grade: certificate.grade,
      issuedAt: issuedAtStr,
      verifyUrl,
      sha256Hash: certificate.sha256Hash,
    });

    // Send official certificate email with PDF attachment
    await this.mailService.sendCertificateEmail(
      user.email,
      user.name,
      course.title,
      certificate.certId,
      pdfBuffer,
    );

    return {
      certificate: {
        certId: certificate.certId,
        sha256Hash: certificate.sha256Hash,
        recipientName: certificate.recipientName,
        courseTitle: certificate.courseTitle,
        issuedAt: certificate.issuedAt.toISOString(),
        verifyUrl: `/verify/${certificate.certId}`,
        grade: certificate.grade,
      },
    };
  }

  async getMyCertificates(userId: string) {
    const certs = await this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });

    return certs.map((c) => ({
      certId: c.certId,
      sha256Hash: c.sha256Hash,
      recipientName: c.recipientName,
      courseTitle: c.courseTitle,
      issuedAt: c.issuedAt.toISOString(),
      verifyUrl: `/verify/${c.certId}`,
      grade: c.grade,
    }));
  }

  async getMyCertificate(userId: string, courseId: string) {
    const cert = await this.prisma.certificate.findFirst({
      where: { userId, courseId },
    });

    if (!cert) {
      throw new NotFoundException('No certificate issued for this course yet.');
    }

    return {
      certificate: {
        certId: cert.certId,
        sha256Hash: cert.sha256Hash,
        recipientName: cert.recipientName,
        courseTitle: cert.courseTitle,
        issuedAt: cert.issuedAt.toISOString(),
        verifyUrl: `/verify/${cert.certId}`,
        grade: cert.grade,
      },
    };
  }

  async downloadCertificatePdf(certId: string): Promise<{ buffer: Buffer; filename: string }> {
    const cert = await this.prisma.certificate.findUnique({
      where: { certId: certId.toUpperCase() },
    });

    if (!cert) {
      throw new NotFoundException('Certificate not found');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verifyUrl = `${frontendUrl}/verify/${cert.certId}`;
    const issuedAtStr = cert.issuedAt.toISOString().split('T')[0];

    const buffer = await this.pdfService.generatePdfBuffer({
      certId: cert.certId,
      recipientName: cert.recipientName,
      courseTitle: cert.courseTitle,
      grade: cert.grade,
      issuedAt: issuedAtStr,
      verifyUrl,
      sha256Hash: cert.sha256Hash,
    });

    return {
      buffer,
      filename: `${cert.certId}-Certificate.pdf`,
    };
  }

  async verify(certId: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { certId: certId.toUpperCase() },
      include: {
        user: {
          select: {
            name: true,
            degree: true,
            college: true,
          },
        },
      },
    });

    if (!cert) {
      return {
        verified: false,
        message: 'No record matches this Certificate ID in the DevAscent Public Ledger.',
      };
    }

    return {
      verified: true,
      recipient: {
        name: cert.recipientName,
        degree: cert.user?.degree || 'BCA / Technical Graduate',
        college: cert.user?.college || 'Affiliated Technical Institution',
      },
      course: {
        title: cert.courseTitle,
        completedAt: cert.issuedAt.toISOString(),
        grade: cert.grade,
      },
      hash: cert.sha256Hash,
      issuedBy: 'DevAscent Academy',
      instructor: 'Shivan Mishra',
      ledgerTimestamp: cert.issuedAt.toISOString(),
    };
  }
}
