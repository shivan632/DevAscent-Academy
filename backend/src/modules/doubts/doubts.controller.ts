import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { DoubtsService } from './doubts.service';
import { CreateDoubtDto } from './dto/create-doubt.dto';
import { AnswerDoubtDto } from './dto/answer-doubt.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('doubts')
@UseGuards(JwtAuthGuard)
export class DoubtsController {
  constructor(private readonly doubtsService: DoubtsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 3600000 } }) // 5 doubts per hour per student
  async createDoubt(
    @CurrentUser() user: any,
    @Body() dto: CreateDoubtDto,
  ) {
    return this.doubtsService.createDoubt(user.id, dto);
  }

  @Get('my')
  async getMyDoubts(
    @CurrentUser() user: any,
    @Query('courseId') courseId?: string,
    @Query('status') status?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.doubtsService.getMyDoubts(user.id, { courseId, status, page, limit });
  }

  @Get('lesson/:lessonId')
  async getLessonDoubts(
    @CurrentUser() user: any,
    @Param('lessonId') lessonId: string,
  ) {
    return this.doubtsService.getLessonDoubts(lessonId, user?.id);
  }
}

@Controller('admin/queries')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminQueriesController {
  constructor(private readonly doubtsService: DoubtsService) {}

  @Get()
  async getAdminQueries(
    @Query('status') status?: string,
    @Query('courseId') courseId?: string,
    @Query('isUrgent') isUrgent?: string,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.doubtsService.getAdminDoubts({
      status,
      courseId,
      isUrgent: isUrgent === 'true' ? true : isUrgent === 'false' ? false : undefined,
      search,
      page,
      limit,
    });
  }

  @Patch(':id/answer')
  async answerQuery(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: AnswerDoubtDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.doubtsService.answerDoubt(user.id, id, dto, ipAddress, userAgent);
  }

  @Delete(':id')
  async deleteQuery(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.doubtsService.deleteDoubt(user.id, id, ipAddress, userAgent);
  }
}
