import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsIn,
  IsInt,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(150, { message: 'Title cannot exceed 150 characters' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Message cannot be empty' })
  @MinLength(5, { message: 'Message must be at least 5 characters' })
  @MaxLength(2000, { message: 'Message cannot exceed 2000 characters' })
  message: string;

  @IsOptional()
  @IsString()
  @IsIn(['INFO', 'ALERT', 'ANNOUNCEMENT', 'SYSTEM'], {
    message: 'Type must be INFO, ALERT, ANNOUNCEMENT, or SYSTEM',
  })
  type?: string = 'ANNOUNCEMENT';

  @IsOptional()
  @IsString()
  @IsIn(['ALL', 'STUDENT', 'ADMIN'])
  targetRole?: string = 'ALL';

  @IsOptional()
  @IsInt()
  targetCohort?: number;

  @IsOptional()
  @IsString()
  targetCourseId?: string;
}
