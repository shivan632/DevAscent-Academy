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
    findFeatured(): Promise<{
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
    findBySlug(slug: string, userId?: string): Promise<{
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
    enrollFree(slug: string, userId: string): Promise<{
        success: boolean;
        message: string;
        enrollment: {
            id: string;
            courseId: string;
            progressPct: number;
            status: string;
            enrolledAt: Date;
            userId: string;
        };
    }>;
    applyCohort(slug: string, userId: string, adminNote?: string): Promise<{
        success: boolean;
        message: string;
        application: {
            id: string;
            courseId: string;
            status: string;
            userId: string;
            adminNote: string | null;
            appliedAt: Date;
            reviewedAt: Date | null;
        };
    }>;
    getLesson(courseSlug: string, lessonId: string, user?: any): Promise<{
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
