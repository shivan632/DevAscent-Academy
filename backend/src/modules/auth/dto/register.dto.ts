import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email address format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsIn(['BCA', 'MCA', 'BTECH', 'OTHER'], { message: 'Degree must be BCA, MCA, BTECH, or OTHER' })
  degree?: 'BCA' | 'MCA' | 'BTECH' | 'OTHER';

  @IsOptional()
  @IsString()
  college?: string;
}
