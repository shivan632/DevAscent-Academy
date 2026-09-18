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

  @Get(':slug')
  async getCourseBySlug(
    @Param('slug') slug: string,
    @Req() req: Request,
  ) {
    const userId = (req as any).user?.id || (req as any).user?.sub;
    return this.coursesService.findBySlug(slug, userId);
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

  @Get(':slug/lessons/:lessonId')
  async getLesson(
    @Param('slug') slug: string,
    @Param('lessonId') lessonId: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.coursesService.getLesson(slug, lessonId, user);
  }
}
