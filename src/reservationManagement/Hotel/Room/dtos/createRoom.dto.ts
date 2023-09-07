import { IsNotEmpty } from 'class-validator';

export class createRoomDto {
  @IsNotEmpty()
  roomNumber: string;

  @IsNotEmpty()
  roomType: string;

  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  pricePerNight: number;

  @IsNotEmpty()
  floor: number;
}
