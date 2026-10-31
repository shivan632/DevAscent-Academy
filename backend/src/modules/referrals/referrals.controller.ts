import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('referrals')
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Get('my-summary')
  @UseGuards(JwtAuthGuard)
  async getMySummary(@CurrentUser() user: any) {
    return this.referralsService.getMyReferralSummary(user.id || user.sub);
  }

  @Post('validate')
  async validateCode(
    @Body() dto: { code: string; userId?: string },
  ) {
    return this.referralsService.validateReferralCode(dto.code, dto.userId);
  }

  @Post('request-payout')
  @UseGuards(JwtAuthGuard)
  async requestPayout(
    @CurrentUser() user: any,
    @Body() dto: { upiId: string; amountPaise?: number },
  ) {
    return this.referralsService.requestPayout(user.id || user.sub, dto.upiId, dto.amountPaise);
  }

  @Get('admin/payouts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAdminPayouts() {
    return this.referralsService.getAdminPayouts();
  }

  @Post('admin/payouts/:payoutId/process')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async processPayout(
    @Param('payoutId') payoutId: string,
    @Body() dto: { action: 'APPROVE' | 'REJECT'; txReference?: string; adminNote?: string },
  ) {
    return this.referralsService.processAdminPayout(payoutId, dto.action, dto.txReference, dto.adminNote);
  }
}

