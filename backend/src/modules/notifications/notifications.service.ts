import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Audit Logging Helper ───────────────────────────────────────────────────
  private async logAction(params: {
    adminId: string;
    action: string;
    targetId?: string;
    targetType?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          adminId: params.adminId,
          action: params.action,
          targetId: params.targetId,
          targetType: params.targetType || 'Notification',
          metadata: params.metadata ?? {},
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (err: any) {
      this.logger.warn(`Failed to write audit log: ${err.message}`);
    }
  }

  // ─── Admin: Broadcast Notification ──────────────────────────────────────────
  async createNotification(
    adminId: string,
    dto: CreateNotificationDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    let resolvedCourseId = dto.targetCourseId || null;

    if (resolvedCourseId) {
      const course = await this.prisma.course.findFirst({
        where: {
          OR: [{ id: resolvedCourseId }, { slug: resolvedCourseId }],
        },
      });
      if (course) {
        resolvedCourseId = course.id;
      }
    }

    const notification = await this.prisma.notification.create({
      data: {
        title: dto.title.trim(),
        message: dto.message.trim(),
        type: dto.type || 'ANNOUNCEMENT',
        targetRole: dto.targetRole || 'ALL',
        targetCohort: dto.targetCohort || null,
        targetCourseId: resolvedCourseId,
        createdById: adminId,
      },
      include: {
        targetCourse: { select: { id: true, title: true, slug: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    await this.logAction({
      adminId,
      action: 'NOTIFICATION_BROADCAST',
      targetId: notification.id,
      targetType: 'Notification',
      metadata: {
        title: notification.title,
        type: notification.type,
        targetRole: notification.targetRole,
        targetCourseId: notification.targetCourseId,
      },
      ipAddress,
      userAgent,
    });

    return notification;
  }

  // ─── Student: Get In-App Notifications with Unread Count ─────────────────────
  async getStudentNotifications(
    userId: string,
    userRole = 'STUDENT',
    query: { page?: number; limit?: number },
  ) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    // Get user's enrolled course IDs
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId, status: 'ACTIVE' },
      select: { courseId: true },
    });
    const userCourseIds = enrollments.map((e) => e.courseId);

    const where: Prisma.NotificationWhereInput = {
      AND: [
        {
          OR: [{ targetRole: 'ALL' }, { targetRole: userRole }],
        },
        {
          OR: [
            { targetCourseId: null },
            { targetCourseId: { in: userCourseIds } },
          ],
        },
      ],
    };

    const [notifications, total, userReads] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          targetCourse: { select: { id: true, title: true, slug: true } },
          createdBy: { select: { id: true, name: true } },
        },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notificationRead.findMany({
        where: { userId },
        select: { notificationId: true },
      }),
    ]);

    const readSet = new Set(userReads.map((r) => r.notificationId));

    const enriched = notifications.map((n) => ({
      ...n,
      isRead: readSet.has(n.id),
    }));

    const unreadCount = Math.max(0, total - readSet.size);

    return {
      notifications: enriched,
      total,
      unreadCount,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ─── Student: Mark Single Notification As Read ──────────────────────────────
  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found`);
    }

    await this.prisma.notificationRead.upsert({
      where: {
        userId_notificationId: {
          userId,
          notificationId,
        },
      },
      update: {
        readAt: new Date(),
      },
      create: {
        userId,
        notificationId,
      },
    });

    return { success: true };
  }

  // ─── Student: Mark All Notifications As Read ────────────────────────────────
  async markAllAsRead(userId: string, userRole = 'STUDENT') {
    // Get all eligible notifications
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId, status: 'ACTIVE' },
      select: { courseId: true },
    });
    const userCourseIds = enrollments.map((e) => e.courseId);

    const eligibleNotifications = await this.prisma.notification.findMany({
      where: {
        AND: [
          {
            OR: [{ targetRole: 'ALL' }, { targetRole: userRole }],
          },
          {
            OR: [
              { targetCourseId: null },
              { targetCourseId: { in: userCourseIds } },
            ],
          },
        ],
      },
      select: { id: true },
    });

    const reads = eligibleNotifications.map((n) => ({
      userId,
      notificationId: n.id,
    }));

    if (reads.length > 0) {
      await this.prisma.notificationRead.createMany({
        data: reads,
        skipDuplicates: true,
      });
    }

    return { success: true, markedCount: reads.length };
  }

  // ─── Admin: List All Sent Broadcasts ─────────────────────────────────────────
  async getAdminNotifications(query: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {};

    if (query.search) {
      const s = query.search.trim();
      where.OR = [
        { title: { contains: s, mode: 'insensitive' } },
        { message: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [notifications, total, totalReadsCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          targetCourse: { select: { id: true, title: true, slug: true } },
          createdBy: { select: { id: true, name: true, email: true } },
          _count: { select: { reads: true } },
        },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notificationRead.count(),
    ]);

    return {
      notifications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        totalBroadcasts: total,
        totalReads: totalReadsCount,
      },
    };
  }

  // ─── Admin: Delete Broadcast ────────────────────────────────────────────────
  async deleteNotification(
    adminId: string,
    id: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    await this.prisma.notification.delete({ where: { id } });

    await this.logAction({
      adminId,
      action: 'NOTIFICATION_DELETED',
      targetId: id,
      targetType: 'Notification',
      metadata: { title: notification.title },
      ipAddress,
      userAgent,
    });

    return { success: true, message: 'Notification broadcast deleted' };
  }
}
