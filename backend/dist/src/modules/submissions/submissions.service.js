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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const certificates_service_1 = require("../certificates/certificates.service");
let SubmissionsService = class SubmissionsService {
    constructor(prisma, certificatesService) {
        this.prisma = prisma;
        this.certificatesService = certificatesService;
    }
    async submitCompletion(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        const course = await this.prisma.course.findUnique({
            where: { id: dto.courseId },
        });
        if (!course) {
            throw new common_1.NotFoundException('Course/Internship not found.');
        }
        const enrollment = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId: dto.courseId } },
        });
        if (!enrollment) {
            throw new common_1.ForbiddenException('You are not enrolled in this track.');
        }
        if (enrollment.progressPct < 100 && user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException(`Course progress is currently at ${enrollment.progressPct}%. You must complete 100% of lessons and assignments before submitting your graduation project.`);
        }
        const gitUrl = dto.gitRepoUrl.trim();
        const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$/;
        if (!githubRegex.test(gitUrl)) {
            throw new common_1.BadRequestException('Invalid GitHub repository URL. Format must be: https://github.com/username/repository');
        }
        const linkedinUrl = dto.linkedinPostUrl.trim();
        if (!linkedinUrl.startsWith('https://www.linkedin.com/')) {
            throw new common_1.BadRequestException('LinkedIn post URL must start with https://www.linkedin.com/');
        }
        const existing = await this.prisma.completionSubmission.findUnique({
            where: { userId_courseId: { userId, courseId: dto.courseId } },
        });
        if (existing) {
            if (existing.status === 'APPROVED') {
                throw new common_1.ConflictException('Your submission has already been approved and certificate issued.');
            }
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
    async getMySubmissions(userId) {
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
    async getAllSubmissions(status) {
        const where = {};
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
    async approveSubmission(submissionId, adminNote) {
        const submission = await this.prisma.completionSubmission.findUnique({
            where: { id: submissionId },
            include: {
                user: true,
                course: true,
            },
        });
        if (!submission) {
            throw new common_1.NotFoundException('Submission not found.');
        }
        if (submission.status === 'APPROVED') {
            throw new common_1.BadRequestException('Submission is already approved.');
        }
        const certResult = await this.certificatesService.issueAndEmailCertificate(submission.userId, submission.courseId, 'Distinction (A+)');
        const updatedSubmission = await this.prisma.completionSubmission.update({
            where: { id: submissionId },
            data: {
                status: 'APPROVED',
                adminNote: adminNote || 'Graduation criteria verified. Certificate dispatched.',
                reviewedAt: new Date(),
            },
        });
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
    async rejectSubmission(submissionId, reason) {
        const submission = await this.prisma.completionSubmission.findUnique({
            where: { id: submissionId },
        });
        if (!submission) {
            throw new common_1.NotFoundException('Submission not found.');
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
};
exports.SubmissionsService = SubmissionsService;
exports.SubmissionsService = SubmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        certificates_service_1.CertificatesService])
], SubmissionsService);
//# sourceMappingURL=submissions.service.js.map