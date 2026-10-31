import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
    let counter = 1;

    while (true) {
      const existing = await this.prisma.user.findUnique({
        where: { username: candidate },
      });
      if (!existing || existing.id === userId) {
        break;
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
    const cleanUsername = username.toLowerCase().trim();

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

    return {
      isPrivate: false,
      user: {
        name: user.name,
        username: user.username,
        bio: user.bio,
        city: user.city,
        college: user.college,
        degree: user.degree,
        graduationYear: user.graduationYear,
        avatarUrl: user.avatarUrl,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        portfolioUrl: user.portfolioUrl,
        skills: parsedSkills,
        joinedAt: user.createdAt,
      },
      verifiedCredentials: user.certificates || [],
      academicDocuments: user.academicDocuments || [],
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
      bio?: string;
      githubUrl?: string;
      linkedinUrl?: string;
      portfolioUrl?: string;
      city?: string;
      college?: string;
      degree?: string;
      skills?: string[];
      portfolioPublic?: boolean;
    },
  ) {
    if (dto.username) {
      const clean = dto.username
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_-]/g, '');

      if (clean.length < 3 || clean.length > 30) {
        throw new BadRequestException('Username must be between 3 and 30 characters');
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
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.githubUrl !== undefined && { githubUrl: dto.githubUrl }),
        ...(dto.linkedinUrl !== undefined && { linkedinUrl: dto.linkedinUrl }),
        ...(dto.portfolioUrl !== undefined && { portfolioUrl: dto.portfolioUrl }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.college !== undefined && { college: dto.college }),
        ...(dto.degree !== undefined && { degree: dto.degree }),
        ...(dto.skills !== undefined && { skills: JSON.stringify(dto.skills) }),
        ...(dto.portfolioPublic !== undefined && { portfolioPublic: dto.portfolioPublic }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        city: true,
        college: true,
        degree: true,
        githubUrl: true,
        linkedinUrl: true,
        portfolioUrl: true,
        skills: true,
        portfolioPublic: true,
      },
    });

    return updated;
  }
}
