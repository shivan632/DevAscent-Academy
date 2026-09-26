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
import { IsString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StudentDetailsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  college?: string;

  @IsOptional()
  @IsString()
  degree?: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => StudentDetailsDto)
  studentDetails?: StudentDetailsDto;
}

export class VerifyPaymentDto {
  @IsNotEmpty()
  @IsString()
  razorpayOrderId: string;

  @IsNotEmpty()
  @IsString()
  razorpayPaymentId: string;

  @IsNotEmpty()
  @IsString()
  razorpaySignature: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-order')
  async createOrder(
    @Req() req: Request,
    @Body() dto: CreateOrderDto,
  ) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    return this.paymentsService.createOrderWithTokenOrGuest(token, dto.courseId, dto.couponCode, dto.studentDetails);
  }

  @Post('verify')
  async verifyPayment(
    @Req() req: Request,
    @Body() dto: VerifyPaymentDto,
  ) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    return this.paymentsService.verifyPaymentWithTokenOrGuest(
      token,
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
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
