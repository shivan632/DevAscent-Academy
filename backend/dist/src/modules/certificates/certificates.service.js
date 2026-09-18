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
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const pdf_service_1 = require("../../shared/pdf.service");
const mail_service_1 = require("../../shared/mail.service");
let CertificatesService = class CertificatesService {
    constructor(prisma, pdfService, mailService) {
        this.prisma = prisma;
        this.pdfService = pdfService;
        this.mailService = mailService;
    }
    generateCertId() {
        const year = new Date().getFullYear();
        const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
        return `DEV-${year}-${randomHex}`;
    }
    computeHash(certId, name, courseTitle, issuedAt) {
        const rawPayload = `${certId}:${name}:${courseTitle}:DevAscent Academy:${issuedAt}`;
        return crypto.createHash('sha256').update(rawPayload).digest('hex');
    }
    async issueAndEmailCertificate(userId, courseId, grade = 'Distinction (A+)') {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        if (!user || !course) {
            throw new common_1.NotFoundException('User or Course not found');
        }
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
        const pdfBuffer = await this.pdfService.generatePdfBuffer({
            certId: certificate.certId,
            recipientName: certificate.recipientName,
            courseTitle: certificate.courseTitle,
            grade: certificate.grade,
            issuedAt: issuedAtStr,
            verifyUrl,
            sha256Hash: certificate.sha256Hash,
        });
        await this.mailService.sendCertificateEmail(user.email, user.name, course.title, certificate.certId, pdfBuffer);
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
    async getMyCertificates(userId) {
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
    async getMyCertificate(userId, courseId) {
        const cert = await this.prisma.certificate.findFirst({
            where: { userId, courseId },
        });
        if (!cert) {
            throw new common_1.NotFoundException('No certificate issued for this course yet.');
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
    async downloadCertificatePdf(certId) {
        const cert = await this.prisma.certificate.findUnique({
            where: { certId: certId.toUpperCase() },
        });
        if (!cert) {
            throw new common_1.NotFoundException('Certificate not found');
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
    async verify(certId) {
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
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pdf_service_1.PdfService,
        mail_service_1.MailService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map