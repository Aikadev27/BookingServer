import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel } from '../schema/Hotel.schema';
import { Model } from 'mongoose';
import { LocationService } from './location.service';
import { User } from 'src/auth/schemas/User.schema';
import { createHotelDto } from '../dtos/createHotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
    @InjectModel(User.name) private userModel: Model<User>,

    private locationService: LocationService,
  ) {}

  async CreateHotel(createHotel: createHotelDto, userId: string) {
    try {
      const findUser = await this.userModel.findById(userId);
      if (!findUser) {
        throw new NotFoundException('User not found.');
      }

      return await this.createHotelWithLocation(createHotel, userId);
    } catch (error) {
      throw error;
    }
  }

  private async createHotelWithLocation(createHotel, userId) {
    const { city, district, street, subAddress } = createHotel;

    const locationParams = {
      city,
      district,
      street,
      subAddress,
    };

    const location = await this.locationService.createLocation(locationParams);
    const hotel = new this.hotelModel({
      ...createHotel,
      ownerId: userId,
      location: location,
      featuredImageUrl: createHotel.featuredImageUrl,
    });

    await hotel.save();
    return { hotelData: hotel };
  }

  async checkHotelDuplicate(
    nameHotel: string,
    ownerId: string,
    street: string,
  ): Promise<boolean> {
    try {
      const findHotel = await this.hotelModel.findOne({
        nameHotel: nameHotel,
        ownerId: ownerId,
        // location: {
        //   street: street,
        // },
        'location.street': street,
      });
      return !!findHotel;
    } catch (error) {
      throw error;
    }
  }
}
