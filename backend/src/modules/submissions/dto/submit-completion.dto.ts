import { IsString, IsUrl, IsNotEmpty } from 'class-validator';

export class SubmitCompletionDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  batch: string;

  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsUrl()
  @IsNotEmpty()
  gitRepoUrl: string;

  @IsUrl()
  @IsNotEmpty()
  linkedinPostUrl: string;
}
