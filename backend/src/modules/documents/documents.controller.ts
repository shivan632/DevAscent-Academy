import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyDocuments(@CurrentUser() user: any) {
    return this.documentsService.getMyDocuments(user.id || user.sub);
  }

  @Post('offer-letter/:courseId')
  @UseGuards(JwtAuthGuard)
  async generateOfferLetter(
    @CurrentUser() user: any,
    @Param('courseId') courseId: string,
  ) {
    return this.documentsService.getOrCreateOfferLetter(user.id || user.sub, courseId);
  }

  @Get(':docId/download')
  async downloadDocument(
    @Param('docId') docId: string,
    @Res() res: Response,
  ) {
    try {
      const { buffer, filename } = await this.documentsService.downloadDocumentPdf(docId);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length,
      });
      res.end(buffer);
    } catch (err: any) {
      console.error(`[DocumentsController] Download error for ${docId}:`, err);
      res.status(err?.status || 500).json({
        success: false,
        error: {
          code: 'DOCUMENT_DOWNLOAD_FAILED',
          message: err?.message || 'Failed to download document PDF',
        },
      });
    }
  }

  @Get('verify/:docId')
  async verifyDocument(@Param('docId') docId: string) {
    return this.documentsService.verifyDocument(docId);
  }
}

