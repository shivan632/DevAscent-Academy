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
        submission: any;
    }>;
    getMySubmissions(userId: string): Promise<any>;
    getAllSubmissions(status?: string): Promise<any>;
    approveSubmission(id: string, adminNote?: string): Promise<{
        success: boolean;
        message: string;
        submission: any;
        certificate: {
            certId: any;
            sha256Hash: any;
            recipientName: any;
            courseTitle: any;
            issuedAt: any;
            verifyUrl: string;
            grade: any;
        };
    }>;
    rejectSubmission(id: string, reason: string): Promise<{
        success: boolean;
        message: string;
        submission: any;
    }>;
}
