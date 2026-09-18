import { PrismaService } from '../../prisma/prisma.service';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: {
        domain?: string;
        level?: string;
        search?: string;
        type?: string;
    }): Promise<{
        courses: any;
    }>;
    findFeatured(): Promise<{
        course: any;
        cohortStatus: {
            filled: number;
            total: any;
            seatsRemaining: any;
            startsOn: any;
            cohortNumber: any;
        };
    }>;
    findBySlug(slug: string, userId?: string): Promise<{
        course: any;
        modules: any;
        enrollment: any;
        application: any;
        submission: any;
        isEnrolled: boolean;
    }>;
    enrollFree(slug: string, userId: string): Promise<{
        success: boolean;
        message: string;
        enrollment: any;
    }>;
    applyCohort(slug: string, userId: string, adminNote?: string): Promise<{
        success: boolean;
        message: string;
        application: any;
    }>;
    getLesson(courseSlug: string, lessonId: string, user?: any): Promise<{
        lesson: {
            id: any;
            lessonNumber: any;
            title: any;
            durationMinutes: any;
            summary: any;
            isFreePreview: any;
            isLocked: boolean;
            videoUrl: any;
        };
        module: {
            id: any;
            title: any;
            lessons: any;
        };
        course: {
            id: any;
            slug: any;
            title: any;
        };
    }>;
}
