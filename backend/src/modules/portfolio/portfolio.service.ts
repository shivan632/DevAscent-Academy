import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const RESERVED_USERNAMES = new Set([
  'admin', 'administrator', 'root', 'system', 'superuser',
  'shivan', 'shivanmishra', 'devascent', 'devascentacademy', 'official',
  'api', 'auth', 'login', 'register', 'signin', 'signup', 'logout',
  'dashboard', 'profile', 'settings', 'account', 'security',
  'courses', 'course', 'internships', 'internship', 'tracks',
  'checkout', 'payment', 'payments', 'refund', 'refunds',
  'verify', 'certificate', 'certificates', 'documents', 'lor',
  'support', 'help', 'contact', 'about', 'about-us', 'privacy',
  'terms', 'disclaimer', 'sitemap', 'robots', 'u', 'user'
]);

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generates or sanitizes a unique username for a user if they don't have one yet.
   */
  async ensureUsername(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.username) return user.username;

    // Generate base slug from name or email
    const baseSlug = (user.name || user.email.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'developer';

    let candidate = baseSlug;
    if (RESERVED_USERNAMES.has(candidate)) {
      candidate = `${baseSlug}-dev`;
    }

    let counter = 1;
    while (true) {
      if (!RESERVED_USERNAMES.has(candidate)) {
        const existing = await this.prisma.user.findUnique({
          where: { username: candidate },
        });
        if (!existing || existing.id === userId) {
          break;
        }
      }
      counter++;
      candidate = `${baseSlug}-${counter}`;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { username: candidate },
    });

    return candidate;
  }

  /**
   * Returns complete public portfolio proof-of-work for @username
   */
  async getPublicPortfolio(username: string) {
    let cleanUsername = username;
    try {
      cleanUsername = decodeURIComponent(username);
    } catch {}
    cleanUsername = cleanUsername
      .replace(/^%40/i, '')
      .replace(/^@/, '')
      .toLowerCase()
      .trim();

    const user: any = await this.prisma.user.findFirst({
      where: {
        username: { equals: cleanUsername, mode: 'insensitive' },
      },
      include: {
        certificates: {
          select: {
            id: true,
            certId: true,
            courseTitle: true,
            grade: true,
            issuedAt: true,
            sha256Hash: true,
          },
          orderBy: { issuedAt: 'desc' },
        },
        academicDocuments: {
          select: {
            id: true,
            docId: true,
            type: true,
            courseTitle: true,
            durationWeeks: true,
            issuedAt: true,
            sha256Hash: true,
          },
          orderBy: { issuedAt: 'desc' },
        },
        completionSubmissions: {
          where: { status: 'APPROVED' },
          select: {
            id: true,
            courseId: true,
            projectName: true,
            gitRepoUrl: true,
            linkedinPostUrl: true,
            submittedAt: true,
            course: {
              select: {
                title: true,
                slug: true,
                cohortNumber: true,
              },
            },
          },
          orderBy: { submittedAt: 'desc' },
        },
        enrollments: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            enrolledAt: true,
            course: {
              select: {
                title: true,
                slug: true,
                cohortNumber: true,
                durationWeeks: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`Developer @${username} not found on DevAscent`);
    }

    if (!user.portfolioPublic) {
      return {
        isPrivate: true,
        name: user.name,
        username: user.username,
      };
    }

    let parsedSkills: string[] = [];
    try {
      parsedSkills = JSON.parse(user.skills || '[]');
    } catch {
      parsedSkills = user.skills ? user.skills.split(',').map((s: string) => s.trim()) : [];
    }

    const lors = (user.academicDocuments || []).filter((doc: any) => doc.type === 'LOR');

    return {
      isPrivate: false,
      user: {
        name: user.name,
        username: user.username,
        headline: user.headline || '',
        bio: user.bio,
        city: user.city,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        avatarUrl: user.avatarUrl,
        resumeUrl: user.resumeUrl,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        leetcodeUrl: user.leetcodeUrl,
        twitterUrl: user.twitterUrl,
        portfolioUrl: user.portfolioUrl,
        skills: parsedSkills,
        achievements: user.achievements || [],
        customProjects: user.customProjects || [],
        joinedAt: user.createdAt,
      },
      verifiedCredentials: user.certificates || [],
      academicDocuments: user.academicDocuments || [],
      lorDocuments: lors,
      verifiedCapstones: user.completionSubmissions || [],
      activeTracks: user.enrollments || [],
    };
  }

  /**
   * Updates student's public portfolio preferences and custom handle
   */
  async updatePortfolioProfile(
    userId: string,
    dto: {
      username?: string;
      headline?: string;
      bio?: string;
      githubUrl?: string;
      linkedinUrl?: string;
      leetcodeUrl?: string;
      twitterUrl?: string;
      portfolioUrl?: string;
      resumeUrl?: string;
      city?: string;
      college?: string;
      degree?: string;
      graduationYear?: string;
      skills?: string[];
      achievements?: any;
      customProjects?: any;
      portfolioPublic?: boolean;
    },
  ) {
    if (dto.username) {
      const clean = dto.username
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_-]/g, '');

      if (clean.length < 3 || clean.length > 24) {
        throw new BadRequestException('Username must be between 3 and 24 characters');
      }

      if (!/^[a-z0-9][a-z0-9_-]{1,22}[a-z0-9]$/.test(clean)) {
        throw new BadRequestException('Username can only contain lowercase letters, numbers, hyphens, and underscores, and must start/end with a letter or number.');
      }

      if (RESERVED_USERNAMES.has(clean)) {
        throw new BadRequestException(`"${clean}" is a reserved system keyword and cannot be used as a username`);
      }

      const existing = await this.prisma.user.findFirst({
        where: {
          username: clean,
          NOT: { id: userId },
        },
      });

      if (existing) {
        throw new BadRequestException('Username is already taken by another engineer');
      }

      dto.username = clean;
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.username && { username: dto.username }),
        ...(dto.headline !== undefined && { headline: dto.headline }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.githubUrl !== undefined && { githubUrl: dto.githubUrl }),
        ...(dto.linkedinUrl !== undefined && { linkedinUrl: dto.linkedinUrl }),
        ...(dto.leetcodeUrl !== undefined && { leetcodeUrl: dto.leetcodeUrl }),
        ...(dto.twitterUrl !== undefined && { twitterUrl: dto.twitterUrl }),
        ...(dto.portfolioUrl !== undefined && { portfolioUrl: dto.portfolioUrl }),
        ...(dto.resumeUrl !== undefined && { resumeUrl: dto.resumeUrl }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.college !== undefined && { college: dto.college }),
        ...(dto.degree !== undefined && { degree: dto.degree }),
        ...(dto.graduationYear !== undefined && { graduationYear: dto.graduationYear }),
        ...(dto.skills !== undefined && { skills: JSON.stringify(dto.skills) }),
        ...(dto.achievements !== undefined && { achievements: dto.achievements }),
        ...(dto.customProjects !== undefined && { customProjects: dto.customProjects }),
        ...(dto.portfolioPublic !== undefined && { portfolioPublic: dto.portfolioPublic }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        headline: true,
        bio: true,
        city: true,
        college: true,
        degree: true,
        graduationYear: true,
        githubUrl: true,
        linkedinUrl: true,
        leetcodeUrl: true,
        twitterUrl: true,
        portfolioUrl: true,
        resumeUrl: true,
        skills: true,
        achievements: true,
        customProjects: true,
        portfolioPublic: true,
      },
    });

    return updated;
  }
}
