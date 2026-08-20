import { IsInt, IsNotEmpty, IsString, IsUrl, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  videoLink: string;

  @IsUrl()
  fileLink: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsInt()
  @Min(1)
  price: number;
}
