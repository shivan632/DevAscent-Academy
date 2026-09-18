"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const mail_service_1 = require("../../shared/mail.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    getCookieOptions(maxAgeMs) {
        const isProd = process.env.NODE_ENV === 'production';
        return {
            httpOnly: true,
            secure: isProd,
            sameSite: (isProd ? 'strict' : 'lax'),
            maxAge: maxAgeMs,
            path: '/',
        };
    }
    setAuthCookies(res, accessToken, refreshToken) {
        res.cookie('access_token', accessToken, this.getCookieOptions(15 * 60 * 1000));
        if (refreshToken) {
            res.cookie('refresh_token', refreshToken, this.getCookieOptions(7 * 24 * 60 * 60 * 1000));
        }
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async register(dto) {
        const normalizedEmail = dto.email.toLowerCase().trim();
        const existing = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
        });
        if (existing) {
            if (existing.isEmailVerified) {
                throw new common_1.ConflictException('An account with this email address already exists.');
            }
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
    async sendOtp(email, name) {
        const normalizedEmail = email.toLowerCase().trim();
        const otp = this.generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
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
    async verifyOtp(email, code, res) {
        const normalizedEmail = email.toLowerCase().trim();
        const cleanCode = code.trim();
        const record = await this.prisma.otpVerification.findUnique({
            where: { email: normalizedEmail },
        });
        if (!record) {
            throw new common_1.BadRequestException('No pending verification code found. Please request a new code.');
        }
        if (new Date() > record.expiresAt) {
            await this.prisma.otpVerification.delete({ where: { email: normalizedEmail } });
            throw new common_1.BadRequestException('Verification code has expired. Please request a new one.');
        }
        if (record.attempts >= 5) {
            await this.prisma.otpVerification.delete({ where: { email: normalizedEmail } });
            throw new common_1.ForbiddenException('Too many incorrect attempts. For security, your code was invalidated. Please request a new code.');
        }
        if (record.code !== cleanCode) {
            const remainingAttempts = 4 - record.attempts;
            await this.prisma.otpVerification.update({
                where: { email: normalizedEmail },
                data: { attempts: { increment: 1 } },
            });
            if (remainingAttempts <= 0) {
                await this.prisma.otpVerification.delete({ where: { email: normalizedEmail } });
                throw new common_1.ForbiddenException('Incorrect code. Too many attempts. Please request a new verification code.');
            }
            throw new common_1.BadRequestException(`Incorrect verification code. ${remainingAttempts} attempt(s) remaining.`);
        }
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
        await this.prisma.otpVerification.delete({ where: { email: normalizedEmail } });
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
    async login(dto, res) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        const isValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid email or password.');
        }
        if (!user.isEmailVerified && user.role !== 'ADMIN') {
            throw new common_1.ForbiddenException({
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
    async logout(res) {
        res.clearCookie('access_token', { path: '/' });
        res.clearCookie('refresh_token', { path: '/' });
        return { success: true, message: 'Logged out successfully.' };
    }
    async googleAuth(token, res) {
        if (!token) {
            throw new common_1.BadRequestException('Google authentication token is required.');
        }
        let googleUser;
        try {
            const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
            if (tokenInfoRes.ok) {
                const data = await tokenInfoRes.json();
                googleUser = {
                    email: data.email,
                    name: data.name || data.given_name || 'Google User',
                    picture: data.picture,
                    sub: data.sub,
                };
            }
            else {
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
                }
                else {
                    throw new common_1.UnauthorizedException('Invalid or expired Google authentication token.');
                }
            }
        }
        catch (err) {
            throw new common_1.UnauthorizedException(err.message || 'Failed to verify Google token with Google servers.');
        }
        if (!googleUser?.email) {
            throw new common_1.BadRequestException('Unable to retrieve email address from Google profile.');
        }
        const normalizedEmail = googleUser.email.toLowerCase().trim();
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
        }
        else {
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
    async refreshToken(refreshToken, res) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token is missing.');
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
                throw new common_1.UnauthorizedException('User not found.');
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
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token.');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map