import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Matches,
} from 'class-validator';

export class ValidateCouponDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]{4,20}$/, {
    message: 'Invalid coupon code format',
  })
  code: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsInt()
  @Min(100)
  amountInPaise: number;
}
