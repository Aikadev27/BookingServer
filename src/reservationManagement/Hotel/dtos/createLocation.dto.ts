import { IsNotEmpty } from 'class-validator';

export class createLocationDto {
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  district: string;

  @IsNotEmpty()
  street: string;

  subAddress: string;

  hotelId: string;
}
