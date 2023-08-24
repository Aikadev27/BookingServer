import { IsEmail, IsNotEmpty } from 'class-validator';
import { createLocationDto } from './createLocation.dto';

export class createHotelDto {
  @IsNotEmpty()
  nameHotel: string;

  @IsNotEmpty()
  @IsEmail()
  emailHotel: string;

  @IsNotEmpty()
  servicePhoneNumber: string;

  @IsNotEmpty()
  desc: string;

  // non required
  featuredImageUrl: string[];

  location: createLocationDto;

  ownerId: string;
}
