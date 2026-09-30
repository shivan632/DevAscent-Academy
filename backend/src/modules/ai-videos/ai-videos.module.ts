import { Module } from '@nestjs/common';
import { AiVideosService } from './ai-videos.service';
import { AiVideosController } from './ai-videos.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiVideosController],
  providers: [AiVideosService],
  exports: [AiVideosService],
})
export class AiVideosModule {}
