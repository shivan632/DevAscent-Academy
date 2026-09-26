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
  async enrollFree(slugOrId: string, userId: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        OR: [{ slug: slugOrId }, { id: slugOrId }],
      },
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

    // Decrement seats remaining in Course table
    await this.prisma.course.update({
      where: { id: course.id },
      data: {
        seatsRemaining: { decrement: 1 },
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
                quiz: {
                  select: { id: true, title: true, passingScore: true },
                },
              },
              orderBy: { lessonNumber: 'asc' },
            },
            quiz: {
              select: { id: true, title: true, passingScore: true },
            },
          },
          orderBy: { moduleNumber: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        quiz: {
          include: {
            questions: {
              select: {
                id: true,
                question: true,
                optionsJson: true,
                codeSnippet: true,
                correctOptionIndex: true,
                explanation: true,
              },
            },
          },
        },
        doubts: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        module: {
          include: {
            course: true,
            quiz: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check enrollment if lesson is not a free preview
    let isEnrolled = false;
    let userProgressMap = new Map<string, boolean>();
    let passedQuizzesMap = new Map<string, boolean>();
    let currentLessonProgress: any = null;

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

      // Get all progress for this user in this course
      const allLessons = course.modules.flatMap((m) => m.lessons);
      const allLessonIds = allLessons.map((l) => l.id);

      const [progressRecords, quizSubmissions] = await Promise.all([
        this.prisma.lessonProgress.findMany({
          where: {
            userId: user.id,
            lessonId: { in: allLessonIds },
          },
        }),
        this.prisma.quizSubmission.findMany({
          where: {
            userId: user.id,
            passed: true,
          },
        }),
      ]);

      progressRecords.forEach((pr) => {
        userProgressMap.set(pr.lessonId, pr.isCompleted);
      });

      quizSubmissions.forEach((qs) => {
        passedQuizzesMap.set(qs.quizId, true);
      });

      currentLessonProgress = progressRecords.find((pr) => pr.lessonId === lesson.id) || null;
    }

    // If lesson is locked (not free preview and not enrolled and not admin)
    const isLocked = !lesson.isFreePreview && !isEnrolled && user?.role !== 'ADMIN';

    // Parse exercise projects safely
    let parsedProjects: any[] = [];
    try {
      parsedProjects = JSON.parse(lesson.exerciseProjects || '[]');
    } catch (e) {
      parsedProjects = [];
    }

    // Flat list of all lessons in sequence for prev / next
    const allSequenceLessons = course.modules.flatMap((m) => m.lessons);
    const currentIndex = allSequenceLessons.findIndex((l) => l.id === lesson.id);
    const prevLesson = currentIndex > 0 ? allSequenceLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allSequenceLessons.length - 1 ? allSequenceLessons[currentIndex + 1] : null;

    // Build enriched module tree for sidebar
    const enrichedModules = course.modules.map((m) => ({
      id: m.id,
      moduleNumber: m.moduleNumber,
      title: m.title,
      description: m.description,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        lessonNumber: l.lessonNumber,
        title: l.title,
        durationMinutes: l.durationMinutes,
        isFreePreview: l.isFreePreview,
        isCompleted: userProgressMap.get(l.id) || false,
        isActive: l.id === lesson.id,
        hasQuiz: !!l.quiz,
        quizPassed: l.quiz ? (passedQuizzesMap.get(l.quiz.id) || false) : false,
      })),
    }));

    const totalLessons = allSequenceLessons.length;
    const completedCount = allSequenceLessons.filter((l) => userProgressMap.get(l.id)).length;
    const overallProgressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

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
        writtenContent: isLocked ? null : lesson.writtenContent,
        exercisePdfUrl: isLocked ? null : lesson.exercisePdfUrl,
        exercisePdfTitle: lesson.exercisePdfTitle || `${lesson.title} - Capstone Exercise Guide`,
        exerciseProjects: parsedProjects,
        isCompleted: currentLessonProgress?.isCompleted || false,
        quiz: lesson.quiz
          ? {
              id: lesson.quiz.id,
              title: lesson.quiz.title,
              passingScore: lesson.quiz.passingScore,
              isPassed: passedQuizzesMap.get(lesson.quiz.id) || false,
              questions: lesson.quiz.questions.map((q) => ({
                id: q.id,
                question: q.question,
                options: JSON.parse(q.optionsJson || '[]'),
                codeSnippet: q.codeSnippet,
                explanation: q.explanation,
                correctOptionIndex: q.correctOptionIndex,
              })),
            }
          : null,
        doubts: (lesson.doubts || []).map((d) => ({
          id: d.id,
          question: d.question,
          answer: d.answer,
          status: d.status,
          createdAt: d.createdAt,
          userName: d.user?.name || 'Student',
          userAvatar: d.user?.avatarUrl || null,
        })),
      },
      module: {
        id: lesson.module.id,
        title: lesson.module.title,
        moduleNumber: lesson.module.moduleNumber,
      },
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        domain: course.domain,
        level: course.level,
        type: course.type,
      },
      modules: enrichedModules,
      navigation: {
        prevLesson: prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null,
        nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null,
        currentIndex: currentIndex + 1,
        totalLessons,
        overallProgressPct,
      },
      isEnrolled,
    };
  }

  async submitDoubt(userId: string, lessonId: string, question: string) {
    if (!question || !question.trim()) {
      throw new BadRequestException('Question content is required');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const doubt = await this.prisma.doubt.create({
      data: {
        userId,
        lessonId,
        question: question.trim(),
        status: 'PENDING',
      },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    return {
      success: true,
      doubt: {
        id: doubt.id,
        question: doubt.question,
        answer: doubt.answer,
        status: doubt.status,
        createdAt: doubt.createdAt,
        userName: doubt.user?.name || 'Student',
        userAvatar: doubt.user?.avatarUrl || null,
      },
    };
  }

  async toggleLessonComplete(userId: string, lessonId: string, forceStatus?: boolean) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const course = lesson.module.course;

    const existing = await this.prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    const newCompleted = forceStatus !== undefined ? forceStatus : !(existing?.isCompleted || false);

    await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        isCompleted: newCompleted,
        lastWatchedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        watchedSeconds: 60,
        isCompleted: newCompleted,
      },
    });

    // Calculate total course completion percentage
    const allCourseLessons = course.modules.flatMap((m) => m.lessons);
    const totalLessons = allCourseLessons.length;

    const completedLessons = await this.prisma.lessonProgress.count({
      where: {
        userId,
        lessonId: { in: allCourseLessons.map((l) => l.id) },
        isCompleted: true,
      },
    });

    const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const courseCompleted = progressPct === 100;

    await this.prisma.enrollment.updateMany({
      where: { userId, courseId: course.id },
      data: {
        progressPct,
        status: courseCompleted ? 'COMPLETED' : 'ACTIVE',
      },
    });

    return {
      success: true,
      isCompleted: newCompleted,
      progressPct,
      courseCompleted,
    };
  }

  async submitLessonQuiz(userId: string, lessonId: string, quizId: string, answers: { questionId: string; selectedIndex: number }[]) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        lesson: {
          include: {
            module: {
              include: {
                course: {
                  include: {
                    modules: {
                      include: {
                        lessons: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    let correctCount = 0;
    const feedback = quiz.questions.map((q) => {
      const submittedAnswer = answers.find((a) => a.questionId === q.id);
      const isCorrect = submittedAnswer?.selectedIndex === q.correctOptionIndex;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        isCorrect,
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanation,
      };
    });

    const scorePct = quiz.questions.length > 0 ? Math.round((correctCount / quiz.questions.length) * 100) : 100;
    const passed = scorePct >= quiz.passingScore;

    await this.prisma.quizSubmission.create({
      data: {
        userId,
        quizId,
        scorePct,
        passed,
      },
    });

    // If passed, auto-mark this lesson as completed!
    if (passed && quiz.lessonId) {
      await this.toggleLessonComplete(userId, quiz.lessonId, true);
    }

    return {
      scorePct,
      passed,
      passingScore: quiz.passingScore,
      feedback,
      correctCount,
      totalQuestions: quiz.questions.length,
    };
  }
}
