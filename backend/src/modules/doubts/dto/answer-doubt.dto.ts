import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class AnswerDoubtDto {
  @IsString()
  @IsNotEmpty({ message: 'Answer cannot be empty' })
  @MinLength(2, { message: 'Answer must be at least 2 characters long' })
  @MaxLength(5000, { message: 'Answer cannot exceed 5000 characters' })
  answer: string;
}
