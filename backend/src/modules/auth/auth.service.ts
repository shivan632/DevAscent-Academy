import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../../shared/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  private getCookieOptions(maxAgeMs: number) {
    const isProd = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: (isProd ? 'strict' : 'lax') as 'strict' | 'lax',
      maxAge: maxAgeMs,
      path: '/',
    };
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken?: string) {
    // 15 minutes for access token
    res.cookie('access_token', accessToken, this.getCookieOptions(15 * 60 * 1000));

    // 7 days for refresh token
    if (refreshToken) {
      res.cookie('refresh_token', refreshToken, this.getCookieOptions(7 * 24 * 60 * 60 * 1000));
    }
  }

  /**
   * Generates a secure random 6-digit numeric OTP.
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Register: creates account in unverified status and dispatches 6-digit OTP email.
   * Does NOT issue JWT tokens until email OTP is confirmed.
   */
  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.isEmailVerified) {
        throw new ConflictException('An account with this email address already exists.');
      }
      // If user exists but hasn't verified yet, update password and resend OTP
      const passwordHash = await bcrypt.hash(dto.password, 12);
      await this.prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          name: dto.name.trim(),
          phone: dto.phone,
          degree: dto.degree,
          college: dto.college,
        },
      });
      return this.sendOtp(normalizedEmail, dto.name.trim());
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: dto.name.trim(),
        phone: dto.phone,
        degree: dto.degree,
        college: dto.college,
        role: 'STUDENT',
        isEmailVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return this.sendOtp(normalizedEmail, user.name);
  }

  /**
   * Sends or re-sends OTP with expiry and rate-limit guard.
   */
  async sendOtp(email: string, name?: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert OTP record with reset attempt counter
    await this.prisma.otpVerification.upsert({
      where: { email: normalizedEmail },
      create: {
        email: normalizedEmail,
        code: otp,
        attempts: 0,
        expiresAt,
      },
      update: {
        code: otp,
        attempts: 0,
        expiresAt,
      },
    });

    const studentName = name || 'Student';
    await this.mailService.sendOtpEmail(normalizedEmail, studentName, otp);

    return {
      success: true,
      email: normalizedEmail,
      message: 'A 6-digit verification code has been sent to your email address.',
      expiresInSeconds: 600,
    };
  }

  /**
   * Verifies OTP with max-5 attempts lockout and issues JWT tokens upon success.
   */
  async verifyOtp(email: string, code: string, res: Response) {
    const normalizedEmail = email.toLowerCase().trim();
    const cleanCode = code.trim();

    const record = await this.prisma.otpVerification.findUnique({
      where: { email: normalizedEmail },
    });

    if (!record) {
      throw new BadRequestException('No pending verification code found. Please request a new code.');
    }

    // Check expiry
    if (new Date() > record.expiresAt) {
      await this.prisma.otpVerification.delete({ where: { email: normalizedEmail } });
      throw new BadRequestException('Verification code has expired. Please request a new one.');
    }

    // Check attempts limit (Max 5 attempts)
    if (record.attempts >= 5) {
      await this.prisma.otpVerification.delete({ where: { email: normalizedEmail } });
      throw new ForbiddenException('Too many incorrect attempts. For security, your code was invalidated. Please request a new code.');
    }

    // Compare code
    if (record.code !== cleanCode) {
      const remainingAttempts = 4 - record.attempts;
      await this.prisma.otpVerification.update({
        where: { email: normalizedEmail },
        data: { attempts: { increment: 1 } },
      });

      if (remainingAttempts <= 0) {
        await this.prisma.otpVerification.delete({ where: { email: normalizedEmail } });
        throw new ForbiddenException('Incorrect code. Too many attempts. Please request a new verification code.');
      }

      throw new BadRequestException(`Incorrect verification code. ${remainingAttempts} attempt(s) remaining.`);
    }

    // Mark user as verified
    const user = await this.prisma.user.update({
      where: { email: normalizedEmail },
      data: { isEmailVerified: true },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        degree: true,
        college: true,
        phone: true,
      },
    });

    // Cleanup OTP record
    await this.prisma.otpVerification.delete({ where: { email: normalizedEmail } });

    // Issue JWT tokens
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'devascent_refresh_jwt_secret_key_change_in_production_min_64_characters_long',
      expiresIn: '7d',
    });

    this.setAuthCookies(res, accessToken, refreshToken);

    return {
      success: true,
      message: 'Email verified successfully! Welcome to DevAscent Academy.',
      user,
      accessToken,
    };
  }

  /**
   * Login: Requires verified email before giving tokens.
   */
  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.isEmailVerified && user.role !== 'ADMIN') {
      throw new ForbiddenException({
        message: 'Your email address has not been verified yet.',
        isEmailVerified: false,
        email: user.email,
      });
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'devascent_refresh_jwt_secret_key_change_in_production_min_64_characters_long',
      expiresIn: '7d',
    });

    this.setAuthCookies(res, accessToken, refreshToken);

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      degree: user.degree,
      college: user.college,
      phone: user.phone,
    };

    return {
      user: safeUser,
      accessToken,
    };
  }

  async logout(res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return { success: true, message: 'Logged out successfully.' };
  }

  /**
   * Google OAuth: Authenticates or registers user via Google ID Token or Access Token.
   */
  async googleAuth(token: string, res: Response) {
    if (!token) {
      throw new BadRequestException('Google authentication token is required.');
    }

    let googleUser: { email: string; name: string; picture?: string; sub: string };

    try {
      // 1. Try verifying as Google ID token (JWT from Google Identity Services)
      const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
      if (tokenInfoRes.ok) {
        const data = await tokenInfoRes.json();
        googleUser = {
          email: data.email,
          name: data.name || data.given_name || 'Google User',
          picture: data.picture,
          sub: data.sub,
        };
      } else {
        // 2. Fallback: Try verifying as Google OAuth access token
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userInfoRes.ok) {
          const data = await userInfoRes.json();
          googleUser = {
            email: data.email,
            name: data.name || 'Google User',
            picture: data.picture,
            sub: data.sub,
          };
        } else {
          throw new UnauthorizedException('Invalid or expired Google authentication token.');
        }
      }
    } catch (err: any) {
      throw new UnauthorizedException(err.message || 'Failed to verify Google token with Google servers.');
    }

    if (!googleUser?.email) {
      throw new BadRequestException('Unable to retrieve email address from Google profile.');
    }

    const normalizedEmail = googleUser.email.toLowerCase().trim();

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (user) {
      if (!user.isEmailVerified) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { isEmailVerified: true },
        });
      }
    } else {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const passwordHash = await bcrypt.hash(randomPassword, 12);
      user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          name: googleUser.name || 'Student',
          role: 'STUDENT',
          isEmailVerified: true,
        },
      });
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'devascent_refresh_jwt_secret_key_change_in_production_min_64_characters_long',
      expiresIn: '7d',
    });

    this.setAuthCookies(res, accessToken, refreshToken);

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      degree: user.degree,
      college: user.college,
      phone: user.phone,
    };

    return {
      success: true,
      user: safeUser,
      accessToken,
    };
  }

  getGoogleAuthUrl() {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/callback/google';
    const scope = encodeURIComponent('openid email profile');
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}&prompt=select_account`;
    return { url, clientId };
  }

  async refreshToken(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'devascent_refresh_jwt_secret_key_change_in_production_min_64_characters_long',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, role: true, isEmailVerified: true },
      });

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET || 'devascent_refresh_jwt_secret_key_change_in_production_min_64_characters_long',
        expiresIn: '7d',
      });

      this.setAuthCookies(res, newAccessToken, newRefreshToken);

      return {
        accessToken: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  /**
   * Returns complete user profile including stats (enrollments, certificates, submissions)
   */
  async getFullProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        degree: true,
        college: true,
        avatarUrl: true,
        bio: true,
        city: true,
        graduationYear: true,
        githubUrl: true,
        linkedinUrl: true,
        portfolioUrl: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            enrollments: true,
            certificates: true,
            completionSubmissions: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return {
      user: {
        ...user,
        enrollmentsCount: user._count.enrollments,
        certificatesCount: user._count.certificates,
        submissionsCount: user._count.completionSubmissions,
      },
    };
  }

  /**
   * Updates basic profile details of the user
   */
  async updateProfile(userId: string, dto: any) {
    const dataToUpdate: any = {};

    if (dto.name !== undefined) dataToUpdate.name = dto.name.trim();
    if (dto.phone !== undefined) dataToUpdate.phone = dto.phone ? dto.phone.trim() : null;
    if (dto.degree !== undefined) dataToUpdate.degree = dto.degree ? dto.degree.trim() : null;
    if (dto.college !== undefined) dataToUpdate.college = dto.college ? dto.college.trim() : null;
    if (dto.avatarUrl !== undefined) dataToUpdate.avatarUrl = dto.avatarUrl ? dto.avatarUrl.trim() : null;
    if (dto.bio !== undefined) dataToUpdate.bio = dto.bio ? dto.bio.trim() : null;
    if (dto.city !== undefined) dataToUpdate.city = dto.city ? dto.city.trim() : null;
    if (dto.graduationYear !== undefined) dataToUpdate.graduationYear = dto.graduationYear ? dto.graduationYear.trim() : null;
    if (dto.githubUrl !== undefined) dataToUpdate.githubUrl = dto.githubUrl ? dto.githubUrl.trim() : null;
    if (dto.linkedinUrl !== undefined) dataToUpdate.linkedinUrl = dto.linkedinUrl ? dto.linkedinUrl.trim() : null;
    if (dto.portfolioUrl !== undefined) dataToUpdate.portfolioUrl = dto.portfolioUrl ? dto.portfolioUrl.trim() : null;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        degree: true,
        college: true,
        avatarUrl: true,
        bio: true,
        city: true,
        graduationYear: true,
        githubUrl: true,
        linkedinUrl: true,
        portfolioUrl: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Profile updated successfully',
      user: updatedUser,
    };
  }

  /**
   * Securely changes the user's password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Current password does not match.');
    }

    if (newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters long.');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return {
      message: 'Password updated successfully.',
    };
  }
}

