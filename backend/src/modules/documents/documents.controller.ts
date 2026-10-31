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
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get('documents/my')
  @UseGuards(JwtAuthGuard)
  async getMyDocuments(@CurrentUser() user: any) {
    return this.documentsService.getMyDocuments(user.id || user.sub);
  }

  @Post('documents/offer-letter/:courseId')
  @UseGuards(JwtAuthGuard)
  async generateOfferLetter(
    @CurrentUser() user: any,
    @Param('courseId') courseId: string,
  ) {
    return this.documentsService.getOrCreateOfferLetter(user.id || user.sub, courseId);
  }

  @Get('documents/:docId/download')
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

  @Get('documents/verify/:docId')
  async verifyDocument(@Param('docId') docId: string) {
    return this.documentsService.verifyDocument(docId);
  }

  // --- Admin Document Endpoints ---
  @Get('admin/academic-documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAdminAcademicDocuments() {
    return this.documentsService.getAllDocumentsAdmin();
  }

  @Post('admin/academic-documents/lor/issue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async issueLorAdmin(
    @Body() dto: { userId: string; courseId: string; grade?: string },
  ) {
    return this.documentsService.getOrCreateLor(dto.userId, dto.courseId, dto.grade || 'Distinction (A+)');
  }
}
