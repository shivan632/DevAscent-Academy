import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { AcademicPdfService } from '../../shared/academic-pdf.service';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private academicPdfService: AcademicPdfService,
  ) {}

  private generateDocId(type: 'OFFER_LETTER' | 'LOR'): string {
    const prefix = type === 'OFFER_LETTER' ? 'DEV-OL-2026' : 'DEV-LOR-2026';
    const randHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${prefix}-${randHex}`;
  }

  private computeHash(docId: string, recipientName: string, courseTitle: string, issuedAt: string): string {
    const raw = `${docId}:${recipientName}:${courseTitle}:DevAscent Academic Ledger:${issuedAt}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  /**
   * Generates or fetches an Internship Offer Letter for an enrolled student.
   */
  async getOrCreateOfferLetter(userId: string, courseId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });

    if (!user || !course) {
      throw new NotFoundException('User or Course not found');
    }

    let doc = await this.prisma.academicDocument.findFirst({
      where: {
        userId,
        courseId,
        type: 'OFFER_LETTER',
      },
    });

    if (!doc) {
      const docId = this.generateDocId('OFFER_LETTER');
      const issuedAt = new Date();
      const issuedAtStr = issuedAt.toISOString().split('T')[0];
      const sha256Hash = this.computeHash(docId, user.name, course.title, issuedAtStr);

      doc = await this.prisma.academicDocument.create({
        data: {
          docId,
          type: 'OFFER_LETTER',
          userId,
          courseId,
          recipientName: user.name,
          courseTitle: course.title,
          durationWeeks: course.durationWeeks || 4,
          sha256Hash,
          issuedAt,
          metadata: {
            cohortNumber: course.cohortNumber || 14,
            college: user.college,
            degree: user.degree,
            stipendDetails: course.stipendDetails,
          },
        },
      });
    }

    return doc;
  }

  /**
   * Generates or fetches an official LOR for a student upon submission approval.
   */
  async getOrCreateLor(userId: string, courseId: string, grade = 'Distinction (A+)') {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });

    if (!user || !course) {
      throw new NotFoundException('User or Course not found');
    }

    let doc = await this.prisma.academicDocument.findFirst({
      where: {
        userId,
        courseId,
        type: 'LOR',
      },
    });

    if (!doc) {
      const docId = this.generateDocId('LOR');
      const issuedAt = new Date();
      const issuedAtStr = issuedAt.toISOString().split('T')[0];
      const sha256Hash = this.computeHash(docId, user.name, course.title, issuedAtStr);

      doc = await this.prisma.academicDocument.create({
        data: {
          docId,
          type: 'LOR',
          userId,
          courseId,
          recipientName: user.name,
          courseTitle: course.title,
          durationWeeks: course.durationWeeks || 4,
          sha256Hash,
          issuedAt,
          metadata: {
            grade,
            college: user.college,
            capstoneTitle: `${course.title} Capstone Project`,
          },
        },
      });
    }

    return doc;
  }

  /**
   * Returns all academic documents (Offer Letters + LORs) belonging to the student.
   */
  async getMyDocuments(userId: string) {
    const documents = await this.prisma.academicDocument.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            cohortNumber: true,
            durationWeeks: true,
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId, status: 'ACTIVE' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            cohortNumber: true,
            durationWeeks: true,
          },
        },
      },
    });

    return {
      documents,
      activeEnrollments: enrollments,
    };
  }

  /**
   * Downloads a document as a vector PDF buffer.
   */
  async downloadDocumentPdf(docId: string): Promise<{ buffer: Buffer; filename: string }> {
    const doc = await this.prisma.academicDocument.findUnique({
      where: { docId },
      include: { user: true, course: true },
    });

    if (!doc) {
      throw new NotFoundException(`Academic document with ID "${docId}" not found`);
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://www.devascentacademy.me';
    const verifyUrl = `${frontendUrl}/verify/${doc.docId}`;
    const issuedDateFormatted = doc.issuedAt.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const meta = (doc.metadata as any) || {};

    let buffer: Buffer;
    let filename: string;

    if (doc.type === 'OFFER_LETTER') {
      buffer = await this.academicPdfService.generateOfferLetterBuffer({
        docId: doc.docId,
        recipientName: doc.recipientName,
        courseTitle: doc.courseTitle,
        durationWeeks: doc.durationWeeks,
        issuedAt: issuedDateFormatted,
        verifyUrl,
        sha256Hash: doc.sha256Hash,
        cohortNumber: meta.cohortNumber || doc.course.cohortNumber || 14,
        college: meta.college || doc.user.college || undefined,
        degree: meta.degree || doc.user.degree || undefined,
      });
      filename = `DevAscent_OfferLetter_${doc.docId}.pdf`;
    } else {
      buffer = await this.academicPdfService.generateLorBuffer({
        docId: doc.docId,
        recipientName: doc.recipientName,
        courseTitle: doc.courseTitle,
        durationWeeks: doc.durationWeeks,
        grade: meta.grade || 'Distinction (A+)',
        issuedAt: issuedDateFormatted,
        verifyUrl,
        sha256Hash: doc.sha256Hash,
        college: meta.college || doc.user.college || undefined,
        capstoneTitle: meta.capstoneTitle,
      });
      filename = `DevAscent_LOR_${doc.docId}.pdf`;
    }

    return { buffer, filename };
  }

  /**
   * Public verification lookup for Offer Letters & LORs.
   */
  async verifyDocument(docId: string) {
    const doc = await this.prisma.academicDocument.findUnique({
      where: { docId },
      include: {
        user: { select: { name: true, college: true, degree: true } },
        course: { select: { title: true, cohortNumber: true, durationWeeks: true } },
      },
    });

    if (!doc) {
      return {
        valid: false,
        message: 'No record found on DevAscent Public Academic Ledger',
      };
    }

    return {
      valid: true,
      docId: doc.docId,
      type: doc.type,
      recipientName: doc.recipientName,
      courseTitle: doc.courseTitle,
      durationWeeks: doc.durationWeeks,
      issuedAt: doc.issuedAt,
      sha256Hash: doc.sha256Hash,
      metadata: doc.metadata,
      authority: 'DevAscent Academy - Office of Academic & Technical Mentorship',
      signatory: 'Shivan Mishra, Founder & Principal Systems Architect',
    };
  }
}

