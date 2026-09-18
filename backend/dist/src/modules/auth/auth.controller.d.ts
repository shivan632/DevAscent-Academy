import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
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
    getProfile(user: any): {
        user: any;
    };
    refresh(refreshToken: string, res: Response): Promise<{
        accessToken: string;
    }>;
}
