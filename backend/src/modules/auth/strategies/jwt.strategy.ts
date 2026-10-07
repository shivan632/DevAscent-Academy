import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req && req.cookies && req.cookies.access_token) {
            return req.cookies.access_token;
          }
          return null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: (() => {
        const secret = configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET;
        if (!secret && process.env.NODE_ENV === 'production') {
          throw new Error('FATAL: JWT_SECRET environment variable is missing in production.');
        }
        return secret || 'devascent_dev_fallback_secret_never_use_in_production_min_64_chars';
      })(),
    });
  }

  async validate(payload: any) {
    const userId = payload?.sub || payload?.id || payload?.userId;
    if (!userId || typeof userId !== 'string') {
      throw new UnauthorizedException('Invalid or expired authentication session');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        degree: true,
        college: true,
        phone: true,
        avatarUrl: true,
        bio: true,
        city: true,
        graduationYear: true,
        githubUrl: true,
        linkedinUrl: true,
        portfolioUrl: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User account not found');
    }

    return user;
  }
}
