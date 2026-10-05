import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsDateString,
  IsBoolean,
} from 'class-validator';

export class UpdateCouponDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses?: number;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
