import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('submissions')
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async submitCompletion(
    @CurrentUser('id') userId: string,
    @Body()
    body: {
      courseId: string;
      batch: string;
      projectName: string;
      gitRepoUrl: string;
      linkedinPostUrl: string;
    },
  ) {
    return this.submissionsService.submitCompletion(userId, body);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMySubmissions(@CurrentUser('id') userId: string) {
    return this.submissionsService.getMySubmissions(userId);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  async getAllSubmissions(@Query('status') status?: string) {
    return this.submissionsService.getAllSubmissions(status);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  async approveSubmission(
    @Param('id') id: string,
    @Body('adminNote') adminNote?: string,
  ) {
    return this.submissionsService.approveSubmission(id, adminNote);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  async rejectSubmission(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.submissionsService.rejectSubmission(id, reason);
  }
}
