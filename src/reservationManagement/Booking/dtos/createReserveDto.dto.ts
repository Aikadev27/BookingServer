import { IsNotEmpty } from 'class-validator';

export class createReserveDto {
  @IsNotEmpty()
  checkInDate: Date;

  @IsNotEmpty()
  checkOutDate: Date;

  @IsNotEmpty()
  userQuantity: number;
}
