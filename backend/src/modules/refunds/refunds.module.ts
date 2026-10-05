import { Module } from '@nestjs/common';
import { RefundsController } from './refunds.controller';
import { RefundsService } from './refunds.service';
import { MailService } from '../../shared/mail.service';

@Module({
  controllers: [RefundsController],
  providers: [RefundsService, MailService],
  exports: [RefundsService],
})
export class RefundsModule {}
