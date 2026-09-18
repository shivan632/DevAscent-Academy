import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CertificatesService } from '../certificates/certificates.service';

@Injectable()
export class SubmissionsService {
  constructor(
    private prisma: PrismaService,
    private certificatesService: CertificatesService,
  ) {}

  /**
   * Submit completion form:
   * 1. Requires 100% course progress
   * 2. Validates GitHub repo URL format (github.com/user/repo)
   * 3. Prevents duplicate submissions
   */
  async submitCompletion(
    userId: string,
    dto: {
      courseId: string;
      batch: string;
      projectName: string;
      gitRepoUrl: string;
      linkedinPostUrl: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });
    if (!course) {
      throw new NotFoundException('Course/Internship not found.');
    }

    // 1. Strict server-side progress verification: Must be enrolled and at 100%
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: dto.courseId } },
    });

    if (!enrollment) {
      throw new ForbiddenException('You are not enrolled in this track.');
    }

    if (enrollment.progressPct < 100 && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        `Course progress is currently at ${enrollment.progressPct}%. You must complete 100% of lessons and assignments before submitting your graduation project.`,
      );
    }

    // 2. Strict GitHub repository URL regex validation
    const gitUrl = dto.gitRepoUrl.trim();
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
    if (!githubRegex.test(gitUrl)) {
      throw new BadRequestException(
        'Invalid GitHub repository URL. Format must be: https://github.com/username/repository',
      );
    }

    // 3. LinkedIn Post URL validation
    const linkedinUrl = dto.linkedinPostUrl.trim();
    if (!linkedinUrl.startsWith('https://www.linkedin.com/')) {
      throw new BadRequestException(
        'LinkedIn post URL must start with https://www.linkedin.com/',
      );
    }

    // 4. Check for existing submission
    const existing = await this.prisma.completionSubmission.findUnique({
      where: { userId_courseId: { userId, courseId: dto.courseId } },
    });

    if (existing) {
      if (existing.status === 'APPROVED') {
        throw new ConflictException('Your submission has already been approved and certificate issued.');
      }
      // If PENDING or REJECTED, update with new details
      const updated = await this.prisma.completionSubmission.update({
        where: { id: existing.id },
        data: {
          name: user.name,
          email: user.email,
          batch: dto.batch.trim(),
          projectName: dto.projectName.trim(),
          gitRepoUrl: gitUrl,
          linkedinPostUrl: linkedinUrl,
          status: 'PENDING',
          adminNote: null,
          submittedAt: new Date(),
          reviewedAt: null,
        },
      });

      return {
        success: true,
        message: 'Your project submission was updated and is now pending admin review.',
        submission: updated,
      };
    }

    // Create fresh submission
    const submission = await this.prisma.completionSubmission.create({
      data: {
        userId,
        courseId: dto.courseId,
        name: user.name,
        email: user.email,
        batch: dto.batch.trim(),
        projectName: dto.projectName.trim(),
        gitRepoUrl: gitUrl,
        linkedinPostUrl: linkedinUrl,
        status: 'PENDING',
      },
    });

    return {
      success: true,
      message: 'Project submitted successfully! Your submission is now under review.',
      submission,
    };
  }

  async getMySubmissions(userId: string) {
    return this.prisma.completionSubmission.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            slug: true,
            type: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async getAllSubmissions(status?: string) {
    const where: any = {};
    if (status) {
      where.status = status.toUpperCase();
    }

    return this.prisma.completionSubmission.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            degree: true,
            college: true,
            phone: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            type: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  /**
   * Admin approves project submission:
   * Automatically creates Certificate, computes tamper-proof hash, generates QR PDF, and emails it.
   */
  async approveSubmission(submissionId: string, adminNote?: string) {
    const submission = await this.prisma.completionSubmission.findUnique({
      where: { id: submissionId },
      include: {
        user: true,
        course: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found.');
    }

    if (submission.status === 'APPROVED') {
      throw new BadRequestException('Submission is already approved.');
    }

    // 1. Issue and email certificate with QR code
    const certResult = await this.certificatesService.issueAndEmailCertificate(
      submission.userId,
      submission.courseId,
      'Distinction (A+)',
    );

    // 2. Mark submission as APPROVED
    const updatedSubmission = await this.prisma.completionSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'APPROVED',
        adminNote: adminNote || 'Graduation criteria verified. Certificate dispatched.',
        reviewedAt: new Date(),
      },
    });

    // 3. Mark enrollment status as COMPLETED
    await this.prisma.enrollment.updateMany({
      where: {
        userId: submission.userId,
        courseId: submission.courseId,
      },
      data: {
        status: 'COMPLETED',
        progressPct: 100,
      },
    });

    return {
      success: true,
      message: 'Submission approved! Official certificate generated and emailed to student.',
      submission: updatedSubmission,
      certificate: certResult.certificate,
    };
  }

  /**
   * Admin rejects submission with constructive feedback
   */
  async rejectSubmission(submissionId: string, reason: string) {
    const submission = await this.prisma.completionSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found.');
    }

    const updated = await this.prisma.completionSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'REJECTED',
        adminNote: reason,
        reviewedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Submission rejected with feedback.',
      submission: updated,
    };
  }
}
