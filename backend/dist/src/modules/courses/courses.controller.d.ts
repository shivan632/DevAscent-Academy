import { Request } from 'express';
import { CoursesService } from './courses.service';
export declare class CoursesController {
    private coursesService;
    constructor(coursesService: CoursesService);
    getCourses(domain?: string, level?: string, search?: string, type?: string): Promise<{
        courses: {
            level: string;
            id: string;
            slug: string;
            title: string;
            description: string;
            priceInPaise: number;
            earlyBirdPriceInPaise: number;
            domain: string;
            thumbnail: string;
            cohortNumber: number;
            seatsRemaining: number;
            totalSeats: number;
            cohortStartsOn: Date;
            type: string;
            isFree: boolean;
            durationWeeks: number;
            isPaidInternship: boolean;
            stipendDetails: string;
            requiresApproval: boolean;
        }[];
    }>;
    getFeatured(): Promise<{
        course: {
            modules: ({
                lessons: {
                    id: string;
                    title: string;
                    lessonNumber: number;
                    durationMinutes: number;
                    isFreePreview: boolean;
                }[];
            } & {
                id: string;
                title: string;
                description: string | null;
                moduleNumber: number;
                courseId: string;
            })[];
        } & {
            level: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            title: string;
            description: string;
            priceInPaise: number;
            earlyBirdPriceInPaise: number;
            domain: string;
            thumbnail: string;
            cohortNumber: number;
            seatsRemaining: number;
            totalSeats: number;
            cohortStartsOn: Date | null;
            isPublished: boolean;
            type: string;
            isFree: boolean;
            objectives: string;
            projects: string;
            assignments: string;
            requirements: string;
            durationWeeks: number | null;
            isPaidInternship: boolean;
            stipendDetails: string | null;
            requiresApproval: boolean;
        };
        cohortStatus: {
            filled: number;
            total: number;
            seatsRemaining: number;
            startsOn: Date;
            cohortNumber: number;
        };
    }>;
    getCourseBySlug(slug: string, req: Request): Promise<{
        course: {
            objectives: string[];
            projects: string[];
            assignments: string[];
            requirements: string[];
            modules: ({
                lessons: {
                    id: string;
                    title: string;
                    lessonNumber: number;
                    durationMinutes: number;
                    isFreePreview: boolean;
                    summary: string;
                }[];
                quiz: {
                    id: string;
                    title: string;
                    passingScore: number;
                };
            } & {
                id: string;
                title: string;
                description: string | null;
                moduleNumber: number;
                courseId: string;
            })[];
            level: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            title: string;
            description: string;
            priceInPaise: number;
            earlyBirdPriceInPaise: number;
            domain: string;
            thumbnail: string;
            cohortNumber: number;
            seatsRemaining: number;
            totalSeats: number;
            cohortStartsOn: Date | null;
            isPublished: boolean;
            type: string;
            isFree: boolean;
            durationWeeks: number | null;
            isPaidInternship: boolean;
            stipendDetails: string | null;
            requiresApproval: boolean;
        };
        modules: ({
            lessons: {
                id: string;
                title: string;
                lessonNumber: number;
                durationMinutes: number;
                isFreePreview: boolean;
                summary: string;
            }[];
            quiz: {
                id: string;
                title: string;
                passingScore: number;
            };
        } & {
            id: string;
            title: string;
            description: string | null;
            moduleNumber: number;
            courseId: string;
        })[];
        enrollment: any;
        application: any;
        submission: any;
        isEnrolled: boolean;
    }>;
    enrollFree(slug: string, user: any): Promise<{
        success: boolean;
        message: string;
        enrollment: {
            id: string;
            status: string;
            courseId: string;
            progressPct: number;
            enrolledAt: Date;
            userId: string;
        };
    }>;
    applyCohort(slug: string, user: any, note?: string): Promise<{
        success: boolean;
        message: string;
        application: {
            id: string;
            status: string;
            adminNote: string | null;
            courseId: string;
            userId: string;
            appliedAt: Date;
            reviewedAt: Date | null;
        };
    }>;
    getLesson(slug: string, lessonId: string, req: Request): Promise<{
        lesson: {
            id: string;
            lessonNumber: number;
            title: string;
            durationMinutes: number;
            summary: string;
            isFreePreview: boolean;
            isLocked: boolean;
            videoUrl: string;
        };
        module: {
            id: string;
            title: string;
            lessons: {
                id: string;
                title: string;
                lessonNumber: number;
                durationMinutes: number;
                isFreePreview: boolean;
            }[];
        };
        course: {
            id: string;
            slug: string;
            title: string;
        };
    }>;
}
