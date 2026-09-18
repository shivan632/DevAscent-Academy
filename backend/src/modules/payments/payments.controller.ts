import {
  Controller,
  Post,
  Body,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @CurrentUser('id') userId: string,
    @Body('courseId') courseId: string,
    @Body('couponCode') couponCode?: string,
  ) {
    return this.paymentsService.createOrder(userId, courseId, couponCode);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  async verifyPayment(
    @CurrentUser('id') userId: string,
    @Body('razorpayOrderId') razorpayOrderId: string,
    @Body('razorpayPaymentId') razorpayPaymentId: string,
    @Body('razorpaySignature') razorpaySignature: string,
  ) {
    return this.paymentsService.verifyPayment(
      userId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    // In Express with json body parser, stringify or raw body
    const bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    return this.paymentsService.handleWebhook(bodyString, signature);
  }
}
