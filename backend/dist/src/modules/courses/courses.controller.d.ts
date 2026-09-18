import { Request } from 'express';
import { CoursesService } from './courses.service';
export declare class CoursesController {
    private coursesService;
    constructor(coursesService: CoursesService);
    getCourses(domain?: string, level?: string, search?: string, type?: string): Promise<{
        courses: any;
    }>;
    getFeatured(): Promise<{
        course: any;
        cohortStatus: {
            filled: number;
            total: any;
            seatsRemaining: any;
            startsOn: any;
            cohortNumber: any;
        };
    }>;
    getCourseBySlug(slug: string, req: Request): Promise<{
        course: any;
        modules: any;
        enrollment: any;
        application: any;
        submission: any;
        isEnrolled: boolean;
    }>;
    enrollFree(slug: string, user: any): Promise<{
        success: boolean;
        message: string;
        enrollment: any;
    }>;
    applyCohort(slug: string, user: any, note?: string): Promise<{
        success: boolean;
        message: string;
        application: any;
    }>;
    getLesson(slug: string, lessonId: string, req: Request): Promise<{
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
