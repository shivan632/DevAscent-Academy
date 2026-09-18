import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        success: boolean;
        email: string;
        message: string;
        expiresInSeconds: number;
    }>;
    verifyOtp(body: {
        email: string;
        code: string;
    }, res: Response): Promise<{
        success: boolean;
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
            phone: string;
            role: string;
            degree: string;
            college: string;
        };
        accessToken: string;
    }>;
    sendOtp(body: {
        email: string;
        name?: string;
    }): Promise<{
        success: boolean;
        email: string;
        message: string;
        expiresInSeconds: number;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            degree: string;
            college: string;
            phone: string;
        };
        accessToken: string;
    }>;
    googleAuth(token: string, credential: string, res: Response): Promise<{
        success: boolean;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            degree: string;
            college: string;
            phone: string;
        };
        accessToken: string;
    }>;
    getGoogleAuthUrl(): {
        url: string;
        clientId: string;
    };
    logout(res: Response): Promise<{
        success: boolean;
        message: string;
    }>;
    getMe(user: any): {
        user: any;
    };
    getProfile(user: any): Promise<{
        user: {
            enrollmentsCount: number;
            certificatesCount: number;
            submissionsCount: number;
            id: string;
            email: string;
            name: string;
            phone: string;
            role: string;
            degree: string;
            college: string;
            avatarUrl: string;
            bio: string;
            city: string;
            graduationYear: string;
            githubUrl: string;
            linkedinUrl: string;
            portfolioUrl: string;
            isEmailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
            _count: {
                enrollments: number;
                certificates: number;
                completionSubmissions: number;
            };
        };
    }>;
    updateProfile(user: any, dto: UpdateProfileDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
            phone: string;
            role: string;
            degree: string;
            college: string;
            avatarUrl: string;
            bio: string;
            city: string;
            graduationYear: string;
            githubUrl: string;
            linkedinUrl: string;
            portfolioUrl: string;
            isEmailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    changePassword(user: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    refresh(refreshToken: string, res: Response): Promise<{
        accessToken: string;
    }>;
}
