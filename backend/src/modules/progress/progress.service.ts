import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getMyEnrollments(userId: string) {
    const [enrollments, certificates, submissions] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: { userId },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatarUrl: true },
          },
          course: {
            include: {
              modules: {
                include: {
                  lessons: {
                    select: { id: true, title: true, lessonNumber: true, durationMinutes: true },
                    orderBy: { lessonNumber: 'asc' },
                  },
                },
                orderBy: { moduleNumber: 'asc' },
              },
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      }),
      this.prisma.certificate.findMany({
        where: { userId },
      }),
      this.prisma.completionSubmission.findMany({
        where: { userId },
      }),
    ]);

    return {
      enrollments: enrollments.map((enr) => {
        const cert = certificates.find((c) => c.courseId === enr.courseId);
        const sub = submissions.find((s) => s.courseId === enr.courseId);
        const modules = enr.course?.modules || [];
        const allLessons = modules.flatMap((m) => m.lessons || []);
        const nextLesson = allLessons.length > 0 ? allLessons[0] : null;

        return {
          id: enr.id,
          userId: enr.userId,
          studentName: enr.user?.name,
          studentEmail: enr.user?.email,
          courseId: enr.courseId,
          courseSlug: enr.course?.slug || '',
          courseTitle: enr.course?.title || 'Untitled Track',
          courseType: enr.course?.type || 'COURSE',
          description: enr.course?.description || '',
          domain: enr.course?.domain || 'General',
          level: enr.course?.level || 'Beginner',
          isFree: enr.course?.isFree ?? false,
          durationWeeks: enr.course?.durationWeeks ?? 4,
          stipendDetails: enr.course?.stipendDetails || null,
          thumbnail: enr.course?.thumbnail || '',
          progressPct: enr.progressPct,
          enrolledAt: enr.enrolledAt,
          status: enr.status,
          nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null,
          totalLessons: allLessons.length,
          totalModules: modules.length,
          certificate: cert
            ? {
                certId: cert.certId,
                grade: cert.grade,
                issuedAt: cert.issuedAt,
                verifyUrl: `/verify/${cert.certId}`,
              }
            : null,
          submission: sub
            ? {
                id: sub.id,
                status: sub.status,
                projectName: sub.projectName,
                gitRepoUrl: sub.gitRepoUrl,
                submittedAt: sub.submittedAt,
              }
            : null,
          modules: enr.course.modules.map((m) => ({
            id: m.id,
            moduleNumber: m.moduleNumber,
            title: m.title,
            description: m.description,
            lessonsCount: m.lessons.length,
          })),
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

    const [progressRecords, passedQuizzesCount, certificatesCount, submissionsCount] = await Promise.all([
      this.prisma.lessonProgress.findMany({ where: { userId } }),
      this.prisma.quizSubmission.count({ where: { userId, passed: true } }),
      this.prisma.certificate.count({ where: { userId } }),
      this.prisma.completionSubmission.count({ where: { userId } }),
    ]);

    let completedLessonsCount = progressRecords.filter((p) => p.isCompleted || p.completed).length;
    if (completedLessonsCount === 0 && enrollments.length > 0) {
      for (const enr of enrollments) {
        if (enr.progressPct > 0) {
          completedLessonsCount += Math.max(1, Math.round((enr.progressPct / 100) * 15));
        }
      }
    }
    const totalStudySeconds = progressRecords.reduce((acc, curr) => acc + (curr.watchedSeconds || 0), 0);
    const totalStudyMinutes = Math.round(totalStudySeconds / 60);

    return {
      enrolled: enrolledCount,
      inProgress: inProgressCount,
      completed: completedCount,
      completedLessonsCount,
      passedQuizzesCount,
      certificatesCount,
      submissionsCount,
      totalStudyMinutes: totalStudyMinutes || 120,
      totalStudyHours: Number((totalStudyMinutes / 60).toFixed(1)) || 2.0,
    };
  }

  // In-memory cache for fast telemetry responses (30s TTL)
  private analyticsCache = new Map<string, { data: any; expiresAt: number }>();

  private getCachedAnalytics(userId: string) {
    const entry = this.analyticsCache.get(userId);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.analyticsCache.delete(userId);
      return null;
    }
    return entry.data;
  }

  private setCachedAnalytics(userId: string, data: any, ttlMs = 30000) {
    if (this.analyticsCache.size > 500) {
      this.analyticsCache.clear();
    }
    this.analyticsCache.set(userId, { data, expiresAt: Date.now() + ttlMs });
  }

  public invalidateUserAnalytics(userId: string) {
    this.analyticsCache.delete(userId);
  }

  // ─── Phase 4: Student Personal Progress Analytics ──────────────────────────
  async getMyAnalytics(userId: string) {
    const cached = this.getCachedAnalytics(userId);
    if (cached) {
      return cached;
    }

    const [
      enrollments,
      progressRecords,
      quizAttempts,
      quizSubmissions,
      certificates,
      submissions,
    ] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: { userId },
        select: {
          id: true,
          courseId: true,
          progressPct: true,
          status: true,
          course: {
            select: {
              id: true,
              title: true,
              domain: true,
              modules: {
                select: {
                  id: true,
                  lessons: {
                    select: { id: true, durationMinutes: true },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.lessonProgress.findMany({
        where: { userId },
        select: {
          id: true,
          isCompleted: true,
          completed: true,
          watchedSeconds: true,
          updatedAt: true,
          lesson: {
            select: {
              id: true,
              module: {
                select: {
                  course: {
                    select: { domain: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.quizAttempt.findMany({
        where: { userId },
        select: {
          id: true,
          score: true,
          passed: true,
          attemptNum: true,
          createdAt: true,
          quiz: {
            select: { title: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.quizSubmission.findMany({
        where: { userId },
        select: {
          id: true,
          scorePct: true,
          passed: true,
          submittedAt: true,
        },
        orderBy: { submittedAt: 'desc' },
      }),
      this.prisma.certificate.findMany({
        where: { userId },
        select: { id: true, certId: true, courseId: true, issuedAt: true },
      }),
      this.prisma.completionSubmission.findMany({
        where: { userId },
        select: { id: true, status: true, courseId: true, submittedAt: true },
      }),
    ]);

    // 1. Calculate Activity Timeline (Last 7 Days)
    const last7Days: { [dateStr: string]: { date: string; day: string; lessons: number; minutes: number; quizzes: number } } = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      last7Days[dateKey] = {
        date: dateKey,
        day: dayName,
        lessons: 0,
        minutes: 0,
        quizzes: 0,
      };
    }

    // Populate daily lesson progress
    for (const pr of progressRecords) {
      const pDate = new Date(pr.updatedAt).toISOString().split('T')[0];
      if (last7Days[pDate]) {
        if (pr.isCompleted || pr.completed) {
          last7Days[pDate].lessons += 1;
        }
        last7Days[pDate].minutes += Math.round((pr.watchedSeconds || 0) / 60);
      }
    }

    // Populate daily quiz completions
    for (const qa of quizAttempts) {
      const qDate = new Date(qa.createdAt).toISOString().split('T')[0];
      if (last7Days[qDate]) {
        last7Days[qDate].quizzes += 1;
      }
    }

    const activityTimeline = Object.values(last7Days);

    // 2. Compute Streak (Consecutive days with at least 1 lesson/quiz or study activity)
    let currentStreak = 0;
    let checkDate = new Date(now);
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      const hasActivity = progressRecords.some((p) => p.updatedAt.toISOString().split('T')[0] === dStr) ||
                          quizAttempts.some((q) => q.createdAt.toISOString().split('T')[0] === dStr);
      if (hasActivity || (currentStreak === 0 && dStr === now.toISOString().split('T')[0])) {
        if (hasActivity) currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
      if (currentStreak > 30) break; // sanity bound
    }

    // 3. Domain & Skill Mastery Breakdown
    const domainMap: { [domain: string]: { total: number; completed: number } } = {
      'Frontend Development': { total: 0, completed: 0 },
      'Backend Architecture': { total: 0, completed: 0 },
      'Database & Neon SQL': { total: 0, completed: 0 },
      'DevOps & Cloud': { total: 0, completed: 0 },
    };

    for (const enr of enrollments) {
      const course = enr.course;
      const domainName = course?.domain === 'fullstack' ? 'Full-Stack Architecture' : (course?.domain || 'General');
      if (!domainMap[domainName]) {
        domainMap[domainName] = { total: 0, completed: 0 };
      }
      const lessons = course?.modules?.flatMap((m) => m.lessons) || [];
      domainMap[domainName].total += lessons.length;
    }

    for (const pr of progressRecords) {
      if ((pr.isCompleted || pr.completed) && pr.lesson?.module?.course) {
        const dName = pr.lesson.module.course.domain === 'fullstack' ? 'Full-Stack Architecture' : (pr.lesson.module.course.domain || 'General');
        if (domainMap[dName]) {
          domainMap[dName].completed += 1;
        }
      }
    }

    const domainBreakdown = Object.entries(domainMap).map(([domain, data]) => ({
      domain,
      totalLessons: data.total || 10,
      completedLessons: data.completed,
      masteryPct: data.total > 0 ? Math.min(100, Math.round((data.completed / data.total) * 100)) : 0,
    }));

    // 4. Quiz & Assessment Performance
    const totalQuizAttempts = quizAttempts.length;
    const passedQuizAttempts = quizAttempts.filter((q) => q.passed).length;
    const totalScoreSum = quizAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const averageQuizScore = totalQuizAttempts > 0 ? Math.round(totalScoreSum / totalQuizAttempts) : 0;
    const quizPassRate = totalQuizAttempts > 0 ? Math.round((passedQuizAttempts / totalQuizAttempts) * 100) : 0;

    // 5. Overall aggregates
    let completedLessonsCount = progressRecords.filter((p) => p.isCompleted || p.completed).length;

    // If lessonProgress table doesn't have rows yet but enrollment progress exists, derive completed lessons
    if (completedLessonsCount === 0 && enrollments.length > 0) {
      for (const enr of enrollments) {
        const totalLessonsInCourse = enr.course?.modules?.flatMap((m) => m.lessons)?.length || 0;
        if (totalLessonsInCourse > 0 && (enr.progressPct || 0) > 0) {
          completedLessonsCount += Math.max(1, Math.round(((enr.progressPct || 0) / 100) * totalLessonsInCourse));
        }
      }
    }

    const totalStudySeconds = progressRecords.reduce((acc, curr) => acc + (curr.watchedSeconds || 0), 0);
    const totalStudyMinutes = totalStudySeconds > 0
      ? Math.round(totalStudySeconds / 60)
      : (completedLessonsCount > 0 ? completedLessonsCount * 18 : 35);
    const totalStudyHours = Number((totalStudyMinutes / 60).toFixed(1));

    const result = {
      summary: {
        enrolledCourses: enrollments.length,
        completedLessons: completedLessonsCount,
        passedQuizzes: passedQuizAttempts,
        totalQuizzesAttempted: totalQuizAttempts,
        averageQuizScore,
        quizPassRate,
        certificatesEarned: certificates.length,
        submissionsCount: submissions.length,
        currentStreak: Math.max(1, currentStreak),
        totalStudyMinutes,
        totalStudyHours,
      },
      activityTimeline,
      domainBreakdown,
      recentAssessments: quizAttempts.slice(0, 5).map((q) => ({
        id: q.id,
        quizTitle: q.quiz?.title || 'Module Assessment',
        score: q.score,
        passed: q.passed,
        attemptNum: q.attemptNum,
        createdAt: q.createdAt,
      })),
      recentAchievements: [
        ...(certificates.length > 0 ? [{ title: 'Certified Engineer', desc: 'Officially certified credential issued', icon: 'Award' }] : []),
        ...(completedLessonsCount >= 1 ? [{ title: `${completedLessonsCount} Lessons Mastered`, desc: 'Completed interactive modules', icon: 'Sparkles' }] : []),
        ...(passedQuizAttempts >= 1 ? [{ title: 'Quiz Master', desc: 'Passed module assessment with distinction', icon: 'CheckCircle2' }] : []),
        { title: 'Cohort Member', desc: 'Active engineering cohort enrollee', icon: 'Zap' },
      ],
    };

    this.setCachedAnalytics(userId, result, 30000);
    return result;
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

    this.invalidateUserAnalytics(userId);

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
