import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) {}

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
    const { buffer, filename } = await this.certificatesService.downloadCertificatePdf(certId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Get('verify/:certId')
  async verifyCertificate(@Param('certId') certId: string) {
    return this.certificatesService.verify(certId);
  }
}
