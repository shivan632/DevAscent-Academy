import { Module } from '@nestjs/common';
import { DoubtsService } from './doubts.service';
import { DoubtsController, AdminQueriesController } from './doubts.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MailService } from '../../shared/mail.service';

@Module({
  imports: [PrismaModule],
  controllers: [DoubtsController, AdminQueriesController],
  providers: [DoubtsService, MailService],
  exports: [DoubtsService],
})
export class DoubtsModule {}
