import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generates or fetches unique referral code for a student (e.g. DEV-SHIVAN25 or DEV-A1B2)
   */
  async ensureReferralCode(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.referralCode) return user.referralCode;

    const namePrefix = (user.name || 'DEV')
      .split(' ')[0]
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, 6) || 'DEV';

    const randHex = crypto.randomBytes(2).toString('hex').toUpperCase();
    const candidate = `DEV-${namePrefix}${randHex}`;

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { referralCode: candidate },
    });

    return updated.referralCode!;
  }

  /**
   * Summary for Student Dashboard "Refer & Earn" tab
   */
  async getMyReferralSummary(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        referralCode: true,
        walletBalancePaise: true,
        payoutUpiId: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const referralCode = user.referralCode || (await this.ensureReferralCode(userId));

    const referrals = await this.prisma.referral.findMany({
      where: { referrerId: userId },
      include: {
        referredUser: {
          select: { name: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const payoutRequests = await this.prisma.payoutRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const totalEarnedPaise = referrals.reduce((sum, r) => sum + r.rewardPaise, 0);

    return {
      referralCode,
      referralLink: `https://www.devascentacademy.me/courses?ref=${referralCode}`,
      walletBalancePaise: user.walletBalancePaise,
      payoutUpiId: user.payoutUpiId,
      totalEarnedPaise,
      totalReferrals: referrals.length,
      history: referrals.map((r) => ({
        id: r.id,
        referredName: r.referredUser.name,
        rewardPaise: r.rewardPaise,
        status: r.status,
        date: r.createdAt,
      })),
      payoutRequests,
    };
  }

  /**
   * Validates a referral code at checkout
   */
  async validateReferralCode(code: string, currentUserId?: string) {
    const cleanCode = code.trim().toUpperCase();

    const referrer = await this.prisma.user.findUnique({
      where: { referralCode: cleanCode },
      select: { id: true, name: true, referralCode: true },
    });

    if (!referrer) {
      return {
        valid: false,
        message: 'Invalid referral code',
      };
    }

    if (currentUserId && referrer.id === currentUserId) {
      return {
        valid: false,
        message: 'You cannot use your own referral code',
      };
    }

    return {
      valid: true,
      referralCode: referrer.referralCode,
      referrerName: referrer.name,
      discountPaise: 10000, // ₹100 instant discount
      message: `₹100 Referral Discount applied from ${referrer.name}!`,
    };
  }

  /**
   * Applies referral reward upon successful payment
   */
  async recordReferralConversion(referralCode: string, referredUserId: string, courseId?: string) {
    const cleanCode = referralCode.trim().toUpperCase();

    const referrer = await this.prisma.user.findUnique({
      where: { referralCode: cleanCode },
    });

    if (!referrer || referrer.id === referredUserId) return null;

    // Create referral record
    const referral = await this.prisma.referral.create({
      data: {
        referralCode: cleanCode,
        referrerId: referrer.id,
        referredUserId,
        courseId,
        discountPaise: 10000,
        rewardPaise: 10000, // ₹100 reward
        status: 'COMPLETED',
      },
    });

    // Credit referrer's wallet
    await this.prisma.user.update({
      where: { id: referrer.id },
      data: {
        walletBalancePaise: { increment: 10000 },
      },
    });

    return referral;
  }

  /**
   * Request UPI Withdrawal for student wallet balance
   */
  async requestPayout(userId: string, upiId: string, amountPaise?: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const cleanUpi = upiId.trim();
    if (!cleanUpi.includes('@') || cleanUpi.length < 5) {
      throw new BadRequestException('Please provide a valid UPI ID (e.g. name@okaxis)');
    }

    const withdrawAmount = amountPaise || user.walletBalancePaise;

    if (withdrawAmount < 10000) {
      throw new BadRequestException('Minimum payout withdrawal is ₹100 (10,000 paise)');
    }

    if (withdrawAmount > user.walletBalancePaise) {
      throw new BadRequestException('Requested payout exceeds your wallet balance');
    }

    // Deduct from wallet immediately & create payout request
    const [payout] = await this.prisma.$transaction([
      this.prisma.payoutRequest.create({
        data: {
          userId,
          amountPaise: withdrawAmount,
          upiId: cleanUpi,
          status: 'PENDING',
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          walletBalancePaise: { decrement: withdrawAmount },
          payoutUpiId: cleanUpi,
        },
      }),
    ]);

    return payout;
  }

  /**
   * Admin: List all pending and processed payout requests
   */
  async getAdminPayouts() {
    return this.prisma.payoutRequest.findMany({
      include: {
        user: {
          select: { name: true, email: true, phone: true, username: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Admin: Process or reject payout
   */
  async processAdminPayout(
    payoutId: string,
    action: 'APPROVE' | 'REJECT',
    txReference?: string,
    adminNote?: string,
  ) {
    const payout = await this.prisma.payoutRequest.findUnique({
      where: { id: payoutId },
    });

    if (!payout) throw new NotFoundException('Payout request not found');
    if (payout.status !== 'PENDING') {
      throw new BadRequestException('Payout has already been processed');
    }

    if (action === 'APPROVE') {
      return this.prisma.payoutRequest.update({
        where: { id: payoutId },
        data: {
          status: 'APPROVED',
          txReference,
          adminNote,
          processedAt: new Date(),
        },
      });
    } else {
      // Refund back to student wallet if rejected
      const [updated] = await this.prisma.$transaction([
        this.prisma.payoutRequest.update({
          where: { id: payoutId },
          data: {
            status: 'REJECTED',
            adminNote,
            processedAt: new Date(),
          },
        }),
        this.prisma.user.update({
          where: { id: payout.userId },
          data: {
            walletBalancePaise: { increment: payout.amountPaise },
          },
        }),
      ]);
      return updated;
    }
  }
}

