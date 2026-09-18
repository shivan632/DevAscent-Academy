"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
let PdfService = class PdfService {
    constructor() {
        this.logoPath = path.resolve(__dirname, '../../../assets/logo.png');
    }
    async generatePdfBuffer(details) {
        const qrBuffer = await QRCode.toBuffer(details.verifyUrl, {
            width: 110,
            margin: 1,
            color: {
                dark: '#1e1b4b',
                light: '#ffffff',
            },
        });
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({
                size: 'A4',
                layout: 'landscape',
                margin: 40,
            });
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', (err) => reject(err));
            const width = doc.page.width;
            const height = doc.page.height;
            doc.rect(20, 20, width - 40, height - 40).lineWidth(3).strokeColor('#4f46e5').stroke();
            doc.rect(26, 26, width - 52, height - 52).lineWidth(1).strokeColor('#c7d2fe').stroke();
            doc.save();
            doc.fillColor('#e0e7ff').circle(30, 30, 8).fill();
            doc.fillColor('#e0e7ff').circle(width - 30, 30, 8).fill();
            doc.fillColor('#e0e7ff').circle(30, height - 30, 8).fill();
            doc.fillColor('#e0e7ff').circle(width - 30, height - 30, 8).fill();
            doc.restore();
            if (fs.existsSync(this.logoPath)) {
                try {
                    doc.image(this.logoPath, width / 2 - 35, 42, { width: 70 });
                }
                catch (e) {
                }
            }
            doc.fontSize(14).font('Helvetica-Bold').fillColor('#6366f1').text('DEVASCENT ACADEMY', 0, 120, { align: 'center', characterSpacing: 2 });
            doc.fontSize(28).font('Helvetica-Bold').fillColor('#0f172a').text('CERTIFICATE OF ACHIEVEMENT', 0, 142, { align: 'center', characterSpacing: 1 });
            doc.fontSize(12).font('Helvetica').fillColor('#64748b').text('THIS IS PROUDLY PRESENTED TO', 0, 185, { align: 'center', characterSpacing: 1.5 });
            doc.fontSize(28).font('Helvetica-Bold').fillColor('#1e1b4b').text(details.recipientName, 0, 210, { align: 'center' });
            doc.fontSize(13).font('Helvetica').fillColor('#334155').text('for successfully completing all curriculum modules, engineering assignments, and', 0, 255, { align: 'center' });
            doc.text('rigorous project assessments with distinction in', 0, 273, { align: 'center' });
            doc.fontSize(20).font('Helvetica-Bold').fillColor('#4338ca').text(details.courseTitle, 0, 298, { align: 'center' });
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#059669').text(`Grade Awarded: ${details.grade}`, 0, 332, { align: 'center' });
            doc.fontSize(11).font('Helvetica').fillColor('#64748b').text(`Issued Date: ${details.issuedAt}`, 0, 350, { align: 'center' });
            doc.image(qrBuffer, 55, height - 150, { width: 85 });
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#1e293b').text('Scan to Verify Credential', 50, height - 60, { width: 95, align: 'center' });
            doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e1b4b').text(`Credential ID: ${details.certId}`, 160, height - 110);
            if (details.sha256Hash) {
                doc.fontSize(8).font('Courier').fillColor('#64748b').text(`Fingerprint: ${details.sha256Hash.substring(0, 32)}...`, 160, height - 94);
            }
            doc.fontSize(9).font('Helvetica').fillColor('#4f46e5').text(`Verify: ${details.verifyUrl}`, 160, height - 78, { link: details.verifyUrl });
            const signX = width - 220;
            doc.moveTo(signX, height - 80).lineTo(signX + 160, height - 80).lineWidth(1).strokeColor('#94a3b8').stroke();
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#0f172a').text('Shivan Mishra', signX, height - 74, { width: 160, align: 'center' });
            doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Founder & Lead Instructor', signX, height - 58, { width: 160, align: 'center' });
            doc.end();
        });
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map