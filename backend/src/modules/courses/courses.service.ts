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

  /**
   * Compute interleaved curriculum with AI Overview milestone video gates and sequential lesson unlocking.
   */
  async getCurriculum(slugOrId: string, userId?: string) {
    const course = await this.prisma.course.findFirst({
      where: {
        OR: [{ id: slugOrId }, { slug: slugOrId }],
      },
      include: {
        aiVideos: {
          orderBy: { order: 'asc' },
        },
        modules: {
          include: {
            lessons: {
              include: {
                quiz: {
                  select: { id: true, title: true, passingScore: true, maxAttempts: true },
                },
              },
              orderBy: { lessonNumber: 'asc' },
            },
          },
          orderBy: { moduleNumber: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    let enrollment: any = null;
    let isEnrolled = false;
    const watchedAiVideoIds = new Set<string>();
    const completedLessonIds = new Set<string>();
    const passedQuizIds = new Set<string>();

    if (userId) {
      enrollment = await this.prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: course.id } },
      });
      isEnrolled = !!enrollment && enrollment.status === 'ACTIVE';

      const [aiVideoProgress, lessonProgress, quizSubmissions] = await Promise.all([
        this.prisma.aiVideoProgress.findMany({
          where: { userId, aiVideo: { courseId: course.id }, watched: true },
        }),
        this.prisma.lessonProgress.findMany({
          where: { userId, isCompleted: true },
        }),
        this.prisma.quizSubmission.findMany({
          where: { userId, passed: true },
        }),
      ]);

      aiVideoProgress.forEach((p) => watchedAiVideoIds.add(p.aiVideoId));
      lessonProgress.forEach((p) => completedLessonIds.add(p.lessonId));
      quizSubmissions.forEach((q) => passedQuizIds.add(q.quizId));
    }

    // Flatten all lessons into global sequence
    const allLessons: any[] = [];
    course.modules.forEach((m) => {
      m.lessons.forEach((l) => {
        allLessons.push({
          ...l,
          moduleId: m.id,
          moduleTitle: m.title,
          moduleNumber: m.moduleNumber,
        });
      });
    });

    // Calculate progression state for each AI Video
    const aiVideosWithStatus = course.aiVideos.map((v) => {
      const isWatched = watchedAiVideoIds.has(v.id);
      let isUnlocked = false;
      let lockReason = '';

      if (!isEnrolled) {
        isUnlocked = v.order === 1; // Preview or locked
        if (!isUnlocked) lockReason = 'Enroll in the course to unlock';
      } else {
        if (v.order === 1) {
          isUnlocked = true;
        } else if (v.order === 2) {
          const requiredLessonCount = Math.min(5, allLessons.length);
          const prevLessons = allLessons.slice(0, requiredLessonCount);
          const allPrevCompleted = prevLessons.length > 0 && prevLessons.every((l) => {
            const completed = completedLessonIds.has(l.id);
            const quizOk = !l.quiz || passedQuizIds.has(l.quiz.id);
            return completed && quizOk;
          });
          isUnlocked = allPrevCompleted;
          if (!isUnlocked) lockReason = `Complete Lessons 1-${requiredLessonCount} and pass their skill quizzes to unlock Video 2`;
        } else if (v.order === 3) {
          const requiredLessonCount = Math.min(10, allLessons.length);
          const prevLessons = allLessons.slice(0, requiredLessonCount);
          const allPrevCompleted = prevLessons.length > 0 && prevLessons.every((l) => {
            const completed = completedLessonIds.has(l.id);
            const quizOk = !l.quiz || passedQuizIds.has(l.quiz.id);
            return completed && quizOk;
          });
          isUnlocked = allPrevCompleted;
          if (!isUnlocked) lockReason = `Complete Lessons 1-${requiredLessonCount} and pass their skill quizzes to unlock Video 3`;
        }
      }

      return {
        id: v.id,
        courseId: v.courseId,
        order: v.order,
        title: v.title,
        description: v.description,
        videoUrl: isUnlocked ? v.videoUrl : null,
        durationSec: v.durationSec,
        unlocksFromLesson: v.unlocksFromLesson,
        unlocksToLesson: v.unlocksToLesson,
        isUnlocked,
        isWatched,
        lockReason,
      };
    });

    // Calculate progression state for lessons
    const lessonsWithStatus = allLessons.map((l, index) => {
      const globalSeq = index + 1; // 1-indexed
      const isCompleted = completedLessonIds.has(l.id);
      const quizPassed = l.quiz ? passedQuizIds.has(l.quiz.id) : true;
      let isUnlocked = false;
      let lockReason = '';

      if (!isEnrolled) {
        isUnlocked = l.isFreePreview;
        if (!isUnlocked) lockReason = 'Enroll to access this lesson';
      } else {
        // Milestone gating check:
        // L1-L5 governed by Video 1
        // L6-L10 governed by Video 2
        // L11-L15 governed by Video 3
        let governingVideo: any = null;
        if (globalSeq >= 1 && globalSeq <= 5) {
          governingVideo = aiVideosWithStatus.find((v) => v.order === 1);
        } else if (globalSeq >= 6 && globalSeq <= 10) {
          governingVideo = aiVideosWithStatus.find((v) => v.order === 2);
        } else if (globalSeq >= 11) {
          governingVideo = aiVideosWithStatus.find((v) => v.order === 3);
        }

        const videoSatisfied = !governingVideo || governingVideo.isWatched;

        if (!videoSatisfied) {
          isUnlocked = false;
          lockReason = `Watch AI Overview Video ${governingVideo.order} first to unlock this milestone batch`;
        } else {
          if (index === 0) {
            isUnlocked = true;
          } else {
            const prevLesson = allLessons[index - 1];
            const prevCompleted = completedLessonIds.has(prevLesson.id);
            const prevQuizOk = !prevLesson.quiz || passedQuizIds.has(prevLesson.quiz.id);

            if (prevCompleted && prevQuizOk) {
              isUnlocked = true;
            } else {
              isUnlocked = false;
              lockReason = `Complete Lesson ${prevLesson.lessonNumber} (${prevLesson.title}) and pass its quiz (70%+) to proceed`;
            }
          }
        }
      }

      return {
        id: l.id,
        moduleId: l.moduleId,
        moduleNumber: l.moduleNumber,
        moduleTitle: l.moduleTitle,
        lessonNumber: l.lessonNumber,
        globalSeq,
        title: l.title,
        durationMinutes: l.durationMinutes,
        summary: l.summary,
        isFreePreview: l.isFreePreview,
        isUnlocked,
        isCompleted,
        lockReason,
        hasQuiz: !!l.quiz,
        quizPassed,
        quiz: l.quiz
          ? {
              id: l.quiz.id,
              title: l.quiz.title,
              passingScore: l.quiz.passingScore,
              maxAttempts: l.quiz.maxAttempts,
            }
          : null,
        exercisePdfTitle: l.exercisePdfTitle,
        hasExercisePdf: !!l.exercisePdfUrl,
      };
    });

    // Assemble Interleaved Curriculum List:
    // [ Video 1, L1..L5, Video 2, L6..L10, Video 3, L11..L15 ]
    const interleavedList: any[] = [];
    const v1 = aiVideosWithStatus.find((v) => v.order === 1);
    if (v1) interleavedList.push({ type: 'ai-video', item: v1 });

    const batch1 = lessonsWithStatus.filter((l) => l.globalSeq >= 1 && l.globalSeq <= 5);
    batch1.forEach((l) => interleavedList.push({ type: 'lesson', item: l }));

    const v2 = aiVideosWithStatus.find((v) => v.order === 2);
    if (v2) interleavedList.push({ type: 'ai-video', item: v2 });

    const batch2 = lessonsWithStatus.filter((l) => l.globalSeq >= 6 && l.globalSeq <= 10);
    batch2.forEach((l) => interleavedList.push({ type: 'lesson', item: l }));

    const v3 = aiVideosWithStatus.find((v) => v.order === 3);
    if (v3) interleavedList.push({ type: 'ai-video', item: v3 });

    const batch3 = lessonsWithStatus.filter((l) => l.globalSeq >= 11);
    batch3.forEach((l) => interleavedList.push({ type: 'lesson', item: l }));

    const allLessonsCompleted = lessonsWithStatus.length > 0 && lessonsWithStatus.every((l) => l.isCompleted && l.quizPassed);
    const allVideosWatched = aiVideosWithStatus.length === 0 || aiVideosWithStatus.every((v) => v.isWatched);
    const isEligibleForCertificate = allLessonsCompleted && allVideosWatched;

    const totalItems = aiVideosWithStatus.length + lessonsWithStatus.length;
    const completedVideos = aiVideosWithStatus.filter((v) => v.isWatched).length;
    const completedLessons = lessonsWithStatus.filter((l) => l.isCompleted && l.quizPassed).length;
    const progressPct = totalItems > 0 ? Math.round(((completedVideos + completedLessons) / totalItems) * 100) : 0;

    return {
      success: true,
      course: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description,
        isFree: course.isFree,
        type: course.type,
        domain: course.domain,
        level: course.level,
      },
      isEnrolled,
      progressPct,
      isEligibleForCertificate,
      stats: {
        totalVideos: aiVideosWithStatus.length,
        watchedVideos: completedVideos,
        totalLessons: lessonsWithStatus.length,
        completedLessons,
        totalItems,
        completedItems: completedVideos + completedLessons,
      },
      aiVideos: aiVideosWithStatus,
      lessons: lessonsWithStatus,
      modules: course.modules.map((m) => ({
        id: m.id,
        moduleNumber: m.moduleNumber,
        title: m.title,
        description: m.description,
        lessons: lessonsWithStatus.filter((l) => l.moduleId === m.id),
      })),
      interleavedCurriculum: interleavedList,
    };
  }

  async getLesson(courseSlug: string, lessonId: string, user?: any) {
    const course = await this.prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        aiVideos: {
          orderBy: { order: 'asc' },
        },
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
                  select: { id: true, title: true, passingScore: true, maxAttempts: true },
                },
              },
              orderBy: { lessonNumber: 'asc' },
            },
            quiz: {
              select: { id: true, title: true, passingScore: true, maxAttempts: true },
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

    const userId = user?.id || user?.sub;
    const curriculumData = await this.getCurriculum(course.id, userId);

    const targetLessonInCurriculum = curriculumData.lessons.find((l) => l.id === lesson.id);
    const isLocked = targetLessonInCurriculum ? !targetLessonInCurriculum.isUnlocked : (!lesson.isFreePreview && !curriculumData.isEnrolled && user?.role !== 'ADMIN');
    const lockReason = targetLessonInCurriculum?.lockReason || (isLocked ? 'Enroll to access this lesson' : '');

    // Parse exercise projects safely
    let parsedProjects: any[] = [];
    try {
      parsedProjects = JSON.parse(lesson.exerciseProjects || '[]');
    } catch (e) {
      parsedProjects = [];
    }

    // Flat list of all lessons in sequence for prev / next
    const allSequenceLessons = curriculumData.lessons;
    const currentIndex = allSequenceLessons.findIndex((l) => l.id === lesson.id);
    const prevLesson = currentIndex > 0 ? allSequenceLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allSequenceLessons.length - 1 ? allSequenceLessons[currentIndex + 1] : null;

    const currentLessonProgress = targetLessonInCurriculum?.isCompleted || false;

    return {
      lesson: {
        id: lesson.id,
        lessonNumber: lesson.lessonNumber,
        globalSeq: targetLessonInCurriculum?.globalSeq || lesson.lessonNumber,
        title: lesson.title,
        durationMinutes: lesson.durationMinutes,
        summary: lesson.summary,
        isFreePreview: lesson.isFreePreview,
        isLocked,
        lockReason,
        writtenContent: isLocked ? null : lesson.writtenContent,
        exercisePdfUrl: isLocked ? null : lesson.exercisePdfUrl,
        exercisePdfTitle: lesson.exercisePdfTitle || `${lesson.title} - Capstone Exercise Guide`,
        exerciseProjects: parsedProjects,
        isCompleted: currentLessonProgress,
        quiz: lesson.quiz
          ? {
              id: lesson.quiz.id,
              title: lesson.quiz.title,
              passingScore: lesson.quiz.passingScore,
              maxAttempts: lesson.quiz.maxAttempts || 3,
              isPassed: targetLessonInCurriculum?.quizPassed || false,
              attemptsCount: userId
                ? await this.prisma.quizAttempt.count({
                    where: { userId, quizId: lesson.quiz.id },
                  })
                : 0,
              attemptsExhausted: userId
                ? (await this.prisma.quizAttempt.count({
                    where: { userId, quizId: lesson.quiz.id },
                  })) >= (lesson.quiz.maxAttempts || 3) && !(targetLessonInCurriculum?.quizPassed || false)
                : false,
              supportEmail: 'support@devascentacademy.me',
              questions: isLocked
                ? []
                : lesson.quiz.questions.map((q) => ({
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
      modules: curriculumData.modules,
      aiVideos: curriculumData.aiVideos,
      interleavedCurriculum: curriculumData.interleavedCurriculum,
      navigation: {
        prevLesson: prevLesson ? { id: prevLesson.id, title: prevLesson.title, isUnlocked: prevLesson.isUnlocked } : null,
        nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title, isUnlocked: nextLesson.isUnlocked } : null,
        currentIndex: currentIndex + 1,
        totalLessons: allSequenceLessons.length,
        overallProgressPct: curriculumData.progressPct,
      },
      isEnrolled: curriculumData.isEnrolled,
      stats: curriculumData.stats,
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
        completed: newCompleted,
        lastWatchedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        watchedSeconds: 60,
        isCompleted: newCompleted,
        completed: newCompleted,
      },
    });

    // Calculate total course completion percentage (Lessons + AI Videos)
    const allCourseLessons = course.modules.flatMap((m) => m.lessons);
    const totalLessons = allCourseLessons.length;
    const totalVideos = await this.prisma.aiVideo.count({ where: { courseId: course.id } });
    const totalItems = totalLessons + totalVideos;

    const [completedLessons, watchedVideos] = await Promise.all([
      this.prisma.lessonProgress.count({
        where: {
          userId,
          lessonId: { in: allCourseLessons.map((l) => l.id) },
          isCompleted: true,
        },
      }),
      this.prisma.aiVideoProgress.count({
        where: {
          userId,
          aiVideo: { courseId: course.id },
          watched: true,
        },
      }),
    ]);

    const progressPct = totalItems > 0 ? Math.round(((completedLessons + watchedVideos) / totalItems) * 100) : 0;
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

    // Check prior attempts count
    const priorAttemptsCount = await this.prisma.quizAttempt.count({
      where: { userId, quizId },
    });

    const maxAttempts = quiz.maxAttempts || 3;

    if (priorAttemptsCount >= maxAttempts) {
      throw new BadRequestException(
        `You have used all ${maxAttempts} attempts for this quiz. Please contact support@devascentacademy.me to request an attempt reset.`
      );
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
    const currentAttemptNum = priorAttemptsCount + 1;

    // Convert answers to object for json storage
    const answersMap: Record<string, number> = {};
    answers.forEach((a) => {
      answersMap[a.questionId] = a.selectedIndex;
    });

    await Promise.all([
      this.prisma.quizSubmission.create({
        data: {
          userId,
          quizId,
          scorePct,
          passed,
        },
      }),
      this.prisma.quizAttempt.create({
        data: {
          userId,
          quizId,
          score: scorePct,
          passed,
          answers: answersMap,
          attemptNum: currentAttemptNum,
        },
      }),
    ]);

    // If passed, auto-mark this lesson as completed!
    if (passed && quiz.lessonId) {
      await this.toggleLessonComplete(userId, quiz.lessonId, true);
    }

    const remainingAttempts = Math.max(0, maxAttempts - currentAttemptNum);

    return {
      scorePct,
      passed,
      passingScore: quiz.passingScore,
      feedback,
      correctCount,
      totalQuestions: quiz.questions.length,
      attemptNum: currentAttemptNum,
      maxAttempts,
      remainingAttempts,
      attemptsExhausted: !passed && remainingAttempts === 0,
      supportEmail: 'support@devascentacademy.me',
    };
  }
}
