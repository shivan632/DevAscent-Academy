import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  Res,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Controller()
export class CertificatesController {
  constructor(
    private certificatesService: CertificatesService,
    private prisma: PrismaService,
  ) {}

  @Get('admin/certificates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllCertificatesAdmin(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.certificatesService.getAllCertificatesAdmin(page, limit, search);
  }

  @Post('admin/certificates/issue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async issueCertificate(
    @Body() dto: { userId: string; courseId: string; grade?: string },
    @CurrentUser() adminUser: any,
    @Req() req: Request,
  ) {
    const result = await this.certificatesService.issueAndEmailCertificate(
      dto.userId,
      dto.courseId,
      dto.grade || 'Distinction (A+)',
    );

    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || '';
    const userAgent = (req.headers['user-agent'] as string) || '';

    await this.prisma.auditLog.create({
      data: {
        adminId: adminUser.id || adminUser.sub,
        action: 'CERTIFICATE_ISSUED',
        targetId: result.certificate.certId,
        targetType: 'Certificate',
        metadata: {
          recipientName: result.certificate.recipientName,
          courseTitle: result.certificate.courseTitle,
          grade: result.certificate.grade,
        },
        ipAddress,
        userAgent,
      },
    }).catch((err) => console.error('Failed to record certificate audit log:', err));

    return result;
  }

  @Get('certificates/my')
  @UseGuards(JwtAuthGuard)
  async getMyCertificates(@CurrentUser() user: any) {
    return this.certificatesService.getMyCertificates(user.id || user.sub);
  }

  @Get('certificates/me/:courseId')
  @UseGuards(JwtAuthGuard)
  async getMyCertificate(
    @CurrentUser() user: any,
    @Param('courseId') courseId: string,
  ) {
    return this.certificatesService.getMyCertificate(user.id || user.sub, courseId);
  }

  @Get('certificates/:certId/download')
  async downloadCertificate(
    @Param('certId') certId: string,
    @Res() res: Response,
  ) {
    try {
      const { buffer, filename } = await this.certificatesService.downloadCertificatePdf(certId);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length,
      });
      res.end(buffer);
    } catch (err: any) {
      console.error(`[CertificatesController] Download error for ${certId}:`, err);
      res.status(err?.status || 500).json({
        success: false,
        error: {
          code: 'CERTIFICATE_DOWNLOAD_FAILED',
          message: err?.message || 'Failed to download certificate PDF',
        },
      });
    }
  }

  @Get('verify/:certId')
  async verifyCertificate(@Param('certId') certId: string) {
    return this.certificatesService.verify(certId);
  }
}
