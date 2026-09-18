"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ProgressService = class ProgressService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyEnrollments(userId) {
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
    async getMyStats(userId) {
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
            totalStudyMinutes: totalStudyMinutes || 120,
        };
    }
    async trackProgress(userId, lessonId, watchSeconds) {
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
            throw new common_1.NotFoundException('Lesson not found');
        }
        const course = lesson.module.course;
        const existing = await this.prisma.lessonProgress.findUnique({
            where: {
                userId_lessonId: { userId, lessonId },
            },
        });
        const newWatchedSeconds = (existing?.watchedSeconds || 0) + watchSeconds;
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
    async getQuiz(quizId) {
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
            throw new common_1.NotFoundException('Quiz not found');
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
    async submitQuiz(userId, quizId, answers) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true },
        });
        if (!quiz) {
            throw new common_1.NotFoundException('Quiz not found');
        }
        let correctCount = 0;
        const feedback = quiz.questions.map((q) => {
            const submittedAnswer = answers.find((a) => a.questionId === q.id);
            const isCorrect = submittedAnswer?.selectedIndex === q.correctOptionIndex;
            if (isCorrect)
                correctCount++;
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
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map