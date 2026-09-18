import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { RefundsService } from './refunds.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('refunds')
export class RefundsController {
  constructor(private refundsService: RefundsService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  async applyRefund(
    @CurrentUser('id') userId: string,
    @Body('orderId') orderId: string,
    @Body('reason') reason: string,
    @Body('upiId') upiId?: string,
  ) {
    return this.refundsService.applyRefund(userId, orderId, reason, upiId);
  }

  @Get('status/:refundId')
  async getStatus(@Param('refundId') refundId: string) {
    return this.refundsService.getStatus(refundId);
  }
}
