import { IsNotEmpty } from 'class-validator';

export class createReserveDto {
  @IsNotEmpty()
  checkInDate: string;

  @IsNotEmpty()
  checkOutDate: string;

  @IsNotEmpty()
  userQuantity: number;
}
