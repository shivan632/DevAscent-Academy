import { PrismaService } from '../../prisma/prisma.service';
export declare class ProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyEnrollments(userId: string): Promise<{
        enrollments: any;
    }>;
    getMyStats(userId: string): Promise<{
        enrolled: any;
        inProgress: any;
        completed: any;
        totalStudyMinutes: number;
    }>;
    trackProgress(userId: string, lessonId: string, watchSeconds: number): Promise<{
        progressPct: number;
        lessonCompleted: boolean;
        courseCompleted: boolean;
    }>;
    getQuiz(quizId: string): Promise<{
        quiz: {
            id: any;
            title: any;
            passingScore: any;
            module: any;
            questions: any;
        };
    }>;
    submitQuiz(userId: string, quizId: string, answers: {
        questionId: string;
        selectedIndex: number;
    }[]): Promise<{
        scorePct: number;
        passed: boolean;
        passingScore: any;
        feedback: any;
    }>;
}
