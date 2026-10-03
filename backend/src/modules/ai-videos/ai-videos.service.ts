import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateAiVideoDto {
  order: number;
  title: string;
  description?: string;
  videoUrl: string;
  durationSec?: number;
  unlocksFromLesson?: number;
  unlocksToLesson?: number;
}

export interface UpdateAiVideoDto {
  order?: number;
  title?: string;
  description?: string;
  videoUrl?: string;
  durationSec?: number;
  unlocksFromLesson?: number;
  unlocksToLesson?: number;
}

@Injectable()
export class AiVideosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper: Resolve Course by ID or Slug
   */
  private async findCourse(slugOrId: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        OR: [{ id: slugOrId }, { slug: slugOrId }],
      },
    });
    if (!course) {
      throw new NotFoundException(`Course not found for: ${slugOrId}`);
    }
    return course;
  }

  /**
   * List all AI Videos for a given course (ordered by order asc)
   */
  async getVideosForCourse(slugOrId: string, userId?: string) {
    const course = await this.findCourse(slugOrId);
    const videos = await this.prisma.aiVideo.findMany({
      where: { courseId: course.id },
      orderBy: { order: 'asc' },
      include: userId
        ? {
            progress: {
              where: { userId },
              select: { watched: true, watchedAt: true },
            },
          }
        : undefined,
    });

    return {
      success: true,
      course: { id: course.id, slug: course.slug, title: course.title },
      videos: videos.map((v) => ({
        id: v.id,
        courseId: v.courseId,
        order: v.order,
        title: v.title,
        description: v.description,
        videoUrl: v.videoUrl,
        durationSec: v.durationSec,
        unlocksFromLesson: v.unlocksFromLesson,
        unlocksToLesson: v.unlocksToLesson,
        isWatched: v.progress && v.progress.length > 0 ? v.progress[0].watched : false,
        watchedAt: v.progress && v.progress.length > 0 ? v.progress[0].watchedAt : null,
      })),
    };
  }

  /**
   * Admin: Create AI Video for a course
   */
  async createVideo(slugOrId: string, dto: CreateAiVideoDto) {
    const course = await this.findCourse(slugOrId);

    if (!dto.title || !dto.videoUrl || !dto.order) {
      throw new BadRequestException('Title, Video URL, and Order (1, 2, or 3) are required');
    }

    // Default unlocksFrom / unlocksTo based on position
    let unlocksFrom = dto.unlocksFromLesson;
    let unlocksTo = dto.unlocksToLesson;

    if (!unlocksFrom || !unlocksTo) {
      if (dto.order === 1) {
        unlocksFrom = 1;
        unlocksTo = 5;
      } else if (dto.order === 2) {
        unlocksFrom = 6;
        unlocksTo = 10;
      } else {
        unlocksFrom = 11;
        unlocksTo = 15;
      }
    }

    const video = await this.prisma.aiVideo.upsert({
      where: {
        courseId_order: {
          courseId: course.id,
          order: dto.order,
        },
      },
      create: {
        courseId: course.id,
        order: dto.order,
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        videoUrl: dto.videoUrl.trim(),
        durationSec: dto.durationSec || 20,
        unlocksFromLesson: unlocksFrom,
        unlocksToLesson: unlocksTo,
      },
      update: {
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        videoUrl: dto.videoUrl.trim(),
        durationSec: dto.durationSec || 20,
        unlocksFromLesson: unlocksFrom,
        unlocksToLesson: unlocksTo,
      },
    });

    return { success: true, video };
  }

  /**
   * Admin: Update an existing AI Video
   */
  async updateVideo(id: string, dto: UpdateAiVideoDto) {
    const existing = await this.prisma.aiVideo.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`AI Video with ID ${id} not found`);
    }

    const video = await this.prisma.aiVideo.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.description !== undefined && { description: dto.description?.trim() || null }),
        ...(dto.videoUrl !== undefined && { videoUrl: dto.videoUrl.trim() }),
        ...(dto.durationSec !== undefined && { durationSec: dto.durationSec }),
        ...(dto.order !== undefined && { order: dto.order }),
        ...(dto.unlocksFromLesson !== undefined && { unlocksFromLesson: dto.unlocksFromLesson }),
        ...(dto.unlocksToLesson !== undefined && { unlocksToLesson: dto.unlocksToLesson }),
      },
    });

    return { success: true, video };
  }

  /**
   * Admin: Delete an AI Video
   */
  async deleteVideo(id: string) {
    const existing = await this.prisma.aiVideo.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`AI Video with ID ${id} not found`);
    }

    await this.prisma.aiVideo.delete({ where: { id } });
    return { success: true, message: 'AI Video deleted successfully' };
  }

  /**
   * Student: Mark AI Video as Watched (Boolean explicit trigger)
   */
  async markWatched(userId: string, videoId: string) {
    if (!userId) {
      throw new BadRequestException('Authentication required: user ID is missing');
    }

    const video = await this.prisma.aiVideo.findUnique({
      where: { id: videoId },
      include: { course: true },
    });

    if (!video) {
      throw new NotFoundException(`AI Video with ID ${videoId} not found`);
    }

    const progress = await this.prisma.aiVideoProgress.upsert({
      where: {
        userId_aiVideoId: {
          userId,
          aiVideoId: videoId,
        },
      },
      create: {
        userId,
        aiVideoId: videoId,
        watched: true,
        watchedAt: new Date(),
      },
      update: {
        watched: true,
        watchedAt: new Date(),
      },
    });

    return {
      success: true,
      message: `AI Video marked as watched! Lessons ${video.unlocksFromLesson}-${video.unlocksToLesson} are now unlocked.`,
      videoId: video.id,
      watched: true,
      unlocksFromLesson: video.unlocksFromLesson,
      unlocksToLesson: video.unlocksToLesson,
    };
  }
}
