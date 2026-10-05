import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateDoubtDto {
  @IsString()
  @IsNotEmpty({ message: 'Question cannot be empty' })
  @MinLength(10, { message: 'Question should be at least 10 characters long' })
  @MaxLength(2000, { message: 'Question cannot exceed 2000 characters' })
  question: string;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  lessonId?: string;

  @IsOptional()
  @IsBoolean()
  isUrgent?: boolean = false;
}
