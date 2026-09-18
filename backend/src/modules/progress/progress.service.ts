import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getMyEnrollments(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  select: { id: true, title: true, lessonNumber: true },
                  orderBy: { lessonNumber: 'asc' },
                },
              },
              orderBy: { moduleNumber: 'asc' },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return {
      enrollments: enrollments.map((enr) => {
        // Find next unfinished lesson
        const allLessons = enr.course.modules.flatMap((m) => m.lessons);
        const nextLesson = allLessons.length > 0 ? allLessons[0] : null;

        return {
          id: enr.id,
          courseId: enr.courseId,
          courseSlug: enr.course.slug,
          courseTitle: enr.course.title,
          thumbnail: enr.course.thumbnail,
          progressPct: enr.progressPct,
          enrolledAt: enr.enrolledAt,
          status: enr.status,
          nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null,
        };
      }),
    };
  }

  async getMyStats(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
    });

    const enrolledCount = enrollments.length;
    const completedCount = enrollments.filter((e) => e.progressPct === 100).length;
    const inProgressCount = enrollments.filter((e) => e.progressPct > 0 && e.progressPct < 100).length;

    const progressRecords = await this.prisma.lessonProgress.findMany({
      where: { userId },
    });

    const totalStudySeconds = progressRecords.reduce((acc, curr) => acc + curr.watchedSeconds, 0);
    const totalStudyMinutes = Math.round(totalStudySeconds / 60);

    return {
      enrolled: enrolledCount,
      inProgress: inProgressCount,
      completed: completedCount,
      totalStudyMinutes: totalStudyMinutes || 120, // default placeholder hours
    };
  }

  async trackProgress(userId: string, lessonId: string, watchSeconds: number) {
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

    // Upsert lesson progress
    const existing = await this.prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });

    const newWatchedSeconds = (existing?.watchedSeconds || 0) + watchSeconds;
    // If watched more than 80% of lesson duration, mark completed
    const isCompleted = newWatchedSeconds >= lesson.durationMinutes * 60 * 0.8;

    await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        watchedSeconds: newWatchedSeconds,
        isCompleted,
        lastWatchedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        watchedSeconds: newWatchedSeconds,
        isCompleted,
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
      progressPct,
      lessonCompleted: isCompleted,
      courseCompleted,
    };
  }

  async getQuiz(quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          select: {
            id: true,
            question: true,
            optionsJson: true,
            codeSnippet: true,
          },
        },
        module: {
          select: {
            id: true,
            title: true,
            course: {
              select: { id: true, slug: true, title: true },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return {
      quiz: {
        id: quiz.id,
        title: quiz.title,
        passingScore: quiz.passingScore,
        module: quiz.module,
        questions: quiz.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: JSON.parse(q.optionsJson),
          codeSnippet: q.codeSnippet,
        })),
      },
    };
  }

  async submitQuiz(userId: string, quizId: string, answers: { questionId: string; selectedIndex: number }[]) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
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

    const scorePct = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = scorePct >= quiz.passingScore;

    await this.prisma.quizSubmission.create({
      data: {
        userId,
        quizId,
        scorePct,
        passed,
      },
    });

    return {
      scorePct,
      passed,
      passingScore: quiz.passingScore,
      feedback,
    };
  }
}
