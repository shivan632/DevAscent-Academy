import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { PdfService } from '../../shared/pdf.service';
import { MailService } from '../../shared/mail.service';

@Module({
  controllers: [CertificatesController],
  providers: [CertificatesService, PdfService, MailService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
