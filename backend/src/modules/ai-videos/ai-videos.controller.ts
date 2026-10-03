import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AiVideosService, CreateAiVideoDto, UpdateAiVideoDto } from './ai-videos.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class AiVideosController {
  constructor(private aiVideosService: AiVideosService) {}

  // ─── ADMIN ENDPOINTS ────────────────────────────────────────────────────────
  @Get('admin/courses/:slug/videos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAdminVideos(@Param('slug') slug: string) {
    return this.aiVideosService.getVideosForCourse(slug);
  }

  @Post('admin/courses/:slug/videos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createAdminVideo(
    @Param('slug') slug: string,
    @Body() dto: CreateAiVideoDto,
  ) {
    return this.aiVideosService.createVideo(slug, dto);
  }

  @Patch('admin/videos/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateAdminVideo(
    @Param('id') id: string,
    @Body() dto: UpdateAiVideoDto,
  ) {
    return this.aiVideosService.updateVideo(id, dto);
  }

  @Delete('admin/videos/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteAdminVideo(@Param('id') id: string) {
    return this.aiVideosService.deleteVideo(id);
  }

  // ─── STUDENT / AUTHENTICATED ENDPOINTS ──────────────────────────────────────
  @Get('courses/:slug/videos')
  @UseGuards(JwtAuthGuard)
  async getCourseVideos(
    @Param('slug') slug: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiVideosService.getVideosForCourse(slug, userId);
  }

  @Post('ai-videos/:id/mark-watched')
  @UseGuards(JwtAuthGuard)
  async markVideoWatched(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiVideosService.markWatched(userId, id);
  }
}
