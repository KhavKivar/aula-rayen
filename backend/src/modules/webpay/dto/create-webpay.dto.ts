import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateWebpayDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amountToPay: number;
}
