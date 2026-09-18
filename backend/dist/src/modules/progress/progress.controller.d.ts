import { ProgressService } from './progress.service';
export declare class ProgressController {
    private progressService;
    constructor(progressService: ProgressService);
    getMyEnrollments(userId: string): Promise<{
        enrollments: {
            id: string;
            courseId: string;
            courseSlug: string;
            courseTitle: string;
            thumbnail: string;
            progressPct: number;
            enrolledAt: Date;
            status: string;
            nextLesson: {
                id: string;
                title: string;
            };
        }[];
    }>;
    getMyStats(userId: string): Promise<{
        enrolled: number;
        inProgress: number;
        completed: number;
        totalStudyMinutes: number;
    }>;
    trackProgress(userId: string, lessonId: string, watchSeconds: number): Promise<{
        progressPct: number;
        lessonCompleted: boolean;
        courseCompleted: boolean;
    }>;
    getQuiz(quizId: string): Promise<{
        quiz: {
            id: string;
            title: string;
            passingScore: number;
            module: {
                id: string;
                title: string;
                course: {
                    id: string;
                    slug: string;
                    title: string;
                };
            };
            questions: {
                id: string;
                question: string;
                options: any;
                codeSnippet: string;
            }[];
        };
    }>;
    submitQuiz(userId: string, quizId: string, answers: {
        questionId: string;
        selectedIndex: number;
    }[]): Promise<{
        scorePct: number;
        passed: boolean;
        passingScore: number;
        feedback: {
            questionId: string;
            isCorrect: boolean;
            correctOptionIndex: number;
            explanation: string;
        }[];
    }>;
}
