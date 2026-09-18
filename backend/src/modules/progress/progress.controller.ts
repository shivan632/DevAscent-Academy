import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('me/enrollments')
  @UseGuards(JwtAuthGuard)
  async getMyEnrollments(@CurrentUser('id') userId: string) {
    return this.progressService.getMyEnrollments(userId);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  async getMyStats(@CurrentUser('id') userId: string) {
    return this.progressService.getMyStats(userId);
  }

  @Post('progress/track')
  @UseGuards(JwtAuthGuard)
  async trackProgress(
    @CurrentUser('id') userId: string,
    @Body('lessonId') lessonId: string,
    @Body('watchSeconds') watchSeconds: number,
  ) {
    return this.progressService.trackProgress(userId, lessonId, watchSeconds || 15);
  }

  @Get('quiz/:quizId')
  @UseGuards(JwtAuthGuard)
  async getQuiz(@Param('quizId') quizId: string) {
    return this.progressService.getQuiz(quizId);
  }

  @Post('quiz/:quizId/submit')
  @UseGuards(JwtAuthGuard)
  async submitQuiz(
    @CurrentUser('id') userId: string,
    @Param('quizId') quizId: string,
    @Body('answers') answers: { questionId: string; selectedIndex: number }[],
  ) {
    return this.progressService.submitQuiz(userId, quizId, answers || []);
  }
}
