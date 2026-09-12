import { IsInt, Min } from 'class-validator';

export class CreateWebpayDto {
  @IsInt()
  @Min(1)
  declare course_id: number;
}
