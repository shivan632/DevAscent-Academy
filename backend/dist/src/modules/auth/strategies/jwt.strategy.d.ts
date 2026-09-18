import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: string;
        email: string;
        role: string;
    }): Promise<{
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
    }>;
}
export {};
