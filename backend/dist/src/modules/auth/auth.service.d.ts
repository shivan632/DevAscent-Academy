import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../../shared/mail.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private mailService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService);
    private getCookieOptions;
    private setAuthCookies;
    private generateOtp;
    register(dto: RegisterDto): Promise<{
        success: boolean;
        email: string;
        message: string;
        expiresInSeconds: number;
    }>;
    sendOtp(email: string, name?: string): Promise<{
        success: boolean;
        email: string;
        message: string;
        expiresInSeconds: number;
    }>;
    verifyOtp(email: string, code: string, res: Response): Promise<{
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
    logout(res: Response): Promise<{
        success: boolean;
        message: string;
    }>;
    googleAuth(token: string, res: Response): Promise<{
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
    refreshToken(refreshToken: string, res: Response): Promise<{
        accessToken: string;
    }>;
}
