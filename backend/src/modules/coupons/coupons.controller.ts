import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('admin/coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminCouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  async createCoupon(
    @CurrentUser() user: any,
    @Body() dto: CreateCouponDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.couponsService.createCoupon(user.id, dto, ipAddress, userAgent);
  }

  @Get()
  async getCoupons(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('courseId') courseId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.couponsService.getCoupons({
      status,
      search,
      courseId,
      page,
      limit,
    });
  }

  @Get(':id')
  async getCouponById(@Param('id') id: string) {
    return this.couponsService.getCouponById(id);
  }

  @Patch(':id')
  async updateCoupon(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateCouponDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.couponsService.updateCoupon(user.id, id, dto, ipAddress, userAgent);
  }

  @Delete(':id')
  async deactivateCoupon(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.couponsService.deactivateCoupon(user.id, id, ipAddress, userAgent);
  }
}

@Controller('coupons')
export class PublicCouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    return this.couponsService.validateCoupon(
      dto.code,
      dto.courseId,
      dto.amountInPaise,
    );
  }
}
