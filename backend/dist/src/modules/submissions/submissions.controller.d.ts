import { SubmissionsService } from './submissions.service';
export declare class SubmissionsController {
    private submissionsService;
    constructor(submissionsService: SubmissionsService);
    submitCompletion(userId: string, body: {
        courseId: string;
        batch: string;
        projectName: string;
        gitRepoUrl: string;
        linkedinPostUrl: string;
    }): Promise<{
        success: boolean;
        message: string;
        submission: {
            id: string;
            email: string;
            name: string;
            status: string;
            adminNote: string | null;
            courseId: string;
            userId: string;
            reviewedAt: Date | null;
            batch: string;
            projectName: string;
            gitRepoUrl: string;
            linkedinPostUrl: string;
            submittedAt: Date;
        };
    }>;
    getMySubmissions(userId: string): Promise<({
        course: {
            slug: string;
            title: string;
            type: string;
        };
    } & {
        id: string;
        email: string;
        name: string;
        status: string;
        adminNote: string | null;
        courseId: string;
        userId: string;
        reviewedAt: Date | null;
        batch: string;
        projectName: string;
        gitRepoUrl: string;
        linkedinPostUrl: string;
        submittedAt: Date;
    })[]>;
    getAllSubmissions(status?: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            phone: string;
            degree: string;
            college: string;
        };
        course: {
            id: string;
            slug: string;
            title: string;
            type: string;
        };
    } & {
        id: string;
        email: string;
        name: string;
        status: string;
        adminNote: string | null;
        courseId: string;
        userId: string;
        reviewedAt: Date | null;
        batch: string;
        projectName: string;
        gitRepoUrl: string;
        linkedinPostUrl: string;
        submittedAt: Date;
    })[]>;
    approveSubmission(id: string, adminNote?: string): Promise<{
        success: boolean;
        message: string;
        submission: {
            id: string;
            email: string;
            name: string;
            status: string;
            adminNote: string | null;
            courseId: string;
            userId: string;
            reviewedAt: Date | null;
            batch: string;
            projectName: string;
            gitRepoUrl: string;
            linkedinPostUrl: string;
            submittedAt: Date;
        };
        certificate: {
            certId: string;
            sha256Hash: string;
            recipientName: string;
            courseTitle: string;
            issuedAt: string;
            verifyUrl: string;
            grade: string;
        };
    }>;
    rejectSubmission(id: string, reason: string): Promise<{
        success: boolean;
        message: string;
        submission: {
            id: string;
            email: string;
            name: string;
            status: string;
            adminNote: string | null;
            courseId: string;
            userId: string;
            reviewedAt: Date | null;
            batch: string;
            projectName: string;
            gitRepoUrl: string;
            linkedinPostUrl: string;
            submittedAt: Date;
        };
    }>;
}
