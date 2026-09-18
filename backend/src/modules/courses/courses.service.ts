import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { domain?: string; level?: string; search?: string; type?: string }) {
    const where: any = { isPublished: true };

    if (query?.domain) {
      where.domain = query.domain;
    }

    if (query?.type) {
      where.type = query.type.toUpperCase();
    }

    if (query?.level) {
      where.level = { contains: query.level };
    }

    if (query?.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    const courses = await this.prisma.course.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        priceInPaise: true,
        earlyBirdPriceInPaise: true,
        domain: true,
        level: true,
        thumbnail: true,
        cohortNumber: true,
        seatsRemaining: true,
        totalSeats: true,
        cohortStartsOn: true,
        type: true,
        isFree: true,
        durationWeeks: true,
        isPaidInternship: true,
        stipendDetails: true,
        requiresApproval: true,
      },
      orderBy: { cohortNumber: 'desc' },
    });

    return { courses };
  }

  async findFeatured() {
    const course = await this.prisma.course.findFirst({
      where: { slug: 'full-stack-accelerator', isPublished: true },
      include: {
        modules: {
          include: {
            lessons: {
              select: {
                id: true,
                lessonNumber: true,
                title: true,
                durationMinutes: true,
                isFreePreview: true,
              },
            },
          },
          orderBy: { moduleNumber: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Featured cohort not found');
    }

    const filledSeats = course.totalSeats - course.seatsRemaining;

    return {
      course,
      cohortStatus: {
        filled: filledSeats,
        total: course.totalSeats,
        seatsRemaining: course.seatsRemaining,
        startsOn: course.cohortStartsOn,
        cohortNumber: course.cohortNumber,
      },
    };
  }

  async findBySlug(slug: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          include: {
            lessons: {
              select: {
                id: true,
                lessonNumber: true,
                title: true,
                durationMinutes: true,
                isFreePreview: true,
                summary: true,
              },
              orderBy: { lessonNumber: 'asc' },
            },
            quiz: {
              select: {
                id: true,
                title: true,
                passingScore: true,
              },
            },
          },
          orderBy: { moduleNumber: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with slug "${slug}" not found`);
    }

    // Parse JSON metadata safely
    let parsedObjectives: string[] = [];
    let parsedProjects: string[] = [];
    let parsedAssignments: string[] = [];
    let parsedRequirements: string[] = [];

    try { parsedObjectives = JSON.parse(course.objectives || '[]'); } catch (e) {}
    try { parsedProjects = JSON.parse(course.projects || '[]'); } catch (e) {}
    try { parsedAssignments = JSON.parse(course.assignments || '[]'); } catch (e) {}
    try { parsedRequirements = JSON.parse(course.requirements || '[]'); } catch (e) {}

    let enrollment: any = null;
    let application: any = null;
    let submission: any = null;

    if (userId) {
      enrollment = await this.prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: course.id } },
      });
      application = await this.prisma.internshipApplication.findUnique({
        where: { userId_courseId: { userId, courseId: course.id } },
      });
      submission = await this.prisma.completionSubmission.findUnique({
        where: { userId_courseId: { userId, courseId: course.id } },
      });
    }

    return {
      course: {
        ...course,
        objectives: parsedObjectives,
        projects: parsedProjects,
        assignments: parsedAssignments,
        requirements: parsedRequirements,
      },
      modules: course.modules,
      enrollment,
      application,
      submission,
      isEnrolled: !!enrollment && enrollment.status === 'ACTIVE',
    };
  }

  /**
   * Enroll directly into a free course/internship (instant enrollment).
   */
  async enrollFree(slug: string, userId: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!course.isFree) {
      throw new BadRequestException('This course is not free. Please complete checkout to enroll.');
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });

    if (existing) {
      return { success: true, message: 'Already enrolled in this course.', enrollment: existing };
    }

    const enrollment = await this.prisma.enrollment.create({
      data: {
        userId,
        courseId: course.id,
        progressPct: 0,
        status: 'ACTIVE',
      },
    });

    return {
      success: true,
      message: 'Successfully enrolled in free track!',
      enrollment,
    };
  }

  /**
   * Request / Apply for approval for paid cohort or internship
   */
  async applyCohort(slug: string, userId: string, adminNote?: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      throw new NotFoundException('Course/Internship not found');
    }

    const existing = await this.prisma.internshipApplication.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });

    if (existing) {
      return { success: true, message: 'Application already on record.', application: existing };
    }

    const application = await this.prisma.internshipApplication.create({
      data: {
        userId,
        courseId: course.id,
        status: 'PENDING',
        adminNote,
      },
    });

    return {
      success: true,
      message: 'Application submitted! Admin will review your seat.',
      application,
    };
  }

  async getLesson(courseSlug: string, lessonId: string, user?: any) {
    const course = await this.prisma.course.findUnique({
      where: { slug: courseSlug },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
            lessons: {
              select: {
                id: true,
                lessonNumber: true,
                title: true,
                durationMinutes: true,
                isFreePreview: true,
              },
              orderBy: { lessonNumber: 'asc' },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check enrollment if lesson is not a free preview
    let isEnrolled = false;
    if (user) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      });
      isEnrolled = !!enrollment && enrollment.status === 'ACTIVE';
    }

    // If lesson is locked (not free preview and not enrolled)
    const isLocked = !lesson.isFreePreview && !isEnrolled && user?.role !== 'ADMIN';

    return {
      lesson: {
        id: lesson.id,
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        durationMinutes: lesson.durationMinutes,
        summary: lesson.summary,
        isFreePreview: lesson.isFreePreview,
        isLocked,
        videoUrl: isLocked ? null : lesson.videoUrl,
      },
      module: {
        id: lesson.module.id,
        title: lesson.module.title,
        lessons: lesson.module.lessons,
      },
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
      },
    };
  }
}
