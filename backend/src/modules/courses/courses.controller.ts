import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  async getCourses(
    @Query('domain') domain?: string,
    @Query('level') level?: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.coursesService.findAll({ domain, level, search, type });
  }

  @Get('featured')
  async getFeatured() {
    return this.coursesService.findFeatured();
  }

  @Get('platform/telemetry')
  async getPlatformTelemetry() {
    return this.coursesService.getPlatformTelemetry();
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  async getCourseBySlug(
    @Param('slug') slug: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    const userId = user?.id || user?.sub;
    return this.coursesService.findBySlug(slug, userId);
  }

  @Get(':slug/curriculum')
  @UseGuards(OptionalJwtAuthGuard)
  async getCurriculum(
    @Param('slug') slug: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    const userId = user?.id || user?.sub;
    return this.coursesService.getCurriculum(slug, userId);
  }

  @Post(':slug/enroll-free')
  @UseGuards(JwtAuthGuard)
  async enrollFree(
    @Param('slug') slug: string,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.enrollFree(slug, user.id || user.sub);
  }

  @Post(':slug/apply')
  @UseGuards(JwtAuthGuard)
  async applyCohort(
    @Param('slug') slug: string,
    @CurrentUser() user: any,
    @Body('note') note?: string,
  ) {
    return this.coursesService.applyCohort(slug, user.id || user.sub, note);
  }

  @Get(':slug/topics/:topicId/full')
  @UseGuards(OptionalJwtAuthGuard)
  async getTopicFull(
    @Param('slug') slug: string,
    @Param('topicId') topicId: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.coursesService.getTopicFull(slug, topicId, user);
  }

  @Get(':slug/videos/:videoId/full')
  @UseGuards(OptionalJwtAuthGuard)
  async getVideoFull(
    @Param('slug') slug: string,
    @Param('videoId') videoId: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.coursesService.getVideoFull(slug, videoId, user);
  }

  @Get(':slug/quizzes/:quizId/full')
  @UseGuards(OptionalJwtAuthGuard)
  async getQuizFull(
    @Param('slug') slug: string,
    @Param('quizId') quizId: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.coursesService.getQuizFull(slug, quizId, user);
  }

  @Get(':slug/capstone/full')
  @UseGuards(OptionalJwtAuthGuard)
  async getCapstoneFull(
    @Param('slug') slug: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.coursesService.getCapstoneFull(slug, user);
  }

  @Get(':slug/lessons/:lessonId')
  @UseGuards(OptionalJwtAuthGuard)
  async getLesson(
    @Param('slug') slug: string,
    @Param('lessonId') lessonId: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.coursesService.getLesson(slug, lessonId, user);
  }

  @Post(':slug/lessons/:lessonId/doubt')
  @UseGuards(JwtAuthGuard)
  async submitDoubt(
    @Param('slug') slug: string,
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: any,
    @Body('question') question: string,
  ) {
    return this.coursesService.submitDoubt(user.id || user.sub, lessonId, question);
  }

  @Post(':slug/topics/:topicId/complete')
  @UseGuards(JwtAuthGuard)
  async completeTopic(
    @Param('slug') slug: string,
    @Param('topicId') topicId: string,
    @CurrentUser() user: any,
    @Body('forceStatus') forceStatus?: boolean,
  ) {
    return this.coursesService.toggleLessonComplete(user.id || user.sub, topicId, forceStatus);
  }

  @Post(':slug/lessons/:lessonId/complete')
  @UseGuards(JwtAuthGuard)
  async completeLesson(
    @Param('slug') slug: string,
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: any,
    @Body('forceStatus') forceStatus?: boolean,
  ) {
    return this.coursesService.toggleLessonComplete(user.id || user.sub, lessonId, forceStatus);
  }

  @Post(':slug/quizzes/:quizId/submit')
  @UseGuards(JwtAuthGuard)
  async submitQuiz(
    @Param('slug') slug: string,
    @Param('quizId') quizId: string,
    @CurrentUser() user: any,
    @Body('answers') answers: { questionId: string; selectedIndex: number }[],
    @Body('startedAt') startedAt?: string,
  ) {
    return this.coursesService.submitLessonQuiz(user.id || user.sub, '', quizId, answers, startedAt);
  }

  @Post(':slug/lessons/:lessonId/quiz-submit')
  @UseGuards(JwtAuthGuard)
  async submitLessonQuiz(
    @Param('slug') slug: string,
    @Param('lessonId') lessonId: string,
    @CurrentUser() user: any,
    @Body('quizId') quizId: string,
    @Body('answers') answers: { questionId: string; selectedIndex: number }[],
    @Body('startedAt') startedAt?: string,
  ) {
    return this.coursesService.submitLessonQuiz(user.id || user.sub, lessonId, quizId, answers, startedAt);
  }
}
