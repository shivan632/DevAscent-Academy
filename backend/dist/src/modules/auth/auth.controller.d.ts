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
        user: any;
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
            id: any;
            email: any;
            name: any;
            role: any;
            degree: any;
            college: any;
            phone: any;
            avatarUrl: any;
            bio: any;
            city: any;
            graduationYear: any;
            githubUrl: any;
            linkedinUrl: any;
            portfolioUrl: any;
            isEmailVerified: any;
            createdAt: any;
        };
        accessToken: string;
    }>;
    googleAuth(token: string, credential: string, res: Response): Promise<{
        success: boolean;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            degree: any;
            college: any;
            phone: any;
            avatarUrl: any;
            bio: any;
            city: any;
            graduationYear: any;
            githubUrl: any;
            linkedinUrl: any;
            portfolioUrl: any;
            isEmailVerified: any;
            createdAt: any;
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
        user: any;
    }>;
    updateProfile(user: any, dto: UpdateProfileDto): Promise<{
        message: string;
        user: any;
    }>;
    changePassword(user: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    refresh(refreshToken: string, res: Response): Promise<{
        accessToken: string;
    }>;
}
