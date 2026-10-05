import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsDateString,
  Matches,
  IsBoolean,
  ValidateIf,
} from 'class-validator';

export enum DiscountType {
  PERCENT = 'PERCENT',
  FLAT = 'FLAT',
}

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]{4,20}$/, {
    message: 'Coupon code must be uppercase alphanumeric and between 4 to 20 characters',
  })
  code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(DiscountType, {
    message: 'discountType must be either PERCENT or FLAT',
  })
  discountType: DiscountType;

  @IsInt()
  @Min(1, { message: 'discountValue must be greater than 0' })
  @ValidateIf((o) => o.discountType === DiscountType.PERCENT)
  @Max(100, { message: 'Percentage discount cannot exceed 100%' })
  discountValue: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number = 1;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsBoolean()
  isAutoApply?: boolean = false;
}
