import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel } from '../schema/Hotel.schema';
import { Model } from 'mongoose';
import { LocationService } from './location.service';
import { User } from 'src/auth/schemas/User.schema';
import { createHotelDto } from '../dtos/createHotel.dto';
import { Location } from '../schema/Location.schema';
import { Review } from '../schema/Review.schema';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<Hotel>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Location.name) private locationModel: Model<Location>,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
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

    (await hotel.save()).populate('location');

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

  async GetHotelById(id: string): Promise<Hotel> {
    try {
      const findHotel = await this.hotelModel.findById(id);
      if (!findHotel) {
        throw new NotFoundException('hotel not found');
      }
      return findHotel;
    } catch (error) {
      throw error;
    }
  }

  async getHotelsByOwner(userId: string): Promise<Hotel[]> {
    try {
      const listHotels = await this.hotelModel
        .find({ ownerId: userId })
        .populate('location');

      return listHotels;
    } catch (error) {
      throw error;
    }
  }

  // get list hotels by location(city)
  async getHotelsByCity(city: string): Promise<Hotel[]> {
    try {
      const locationsInCity = await this.locationModel.find({ city });
      if (!locationsInCity || locationsInCity.length < 1) {
        throw new NotFoundException(`${city} not found or wrong`);
      }
      const locationIds = locationsInCity.map((location) => location._id);
      const listHotels = this.hotelModel
        .find({ location: { $in: locationIds } })
        .populate('location');

      return listHotels;
    } catch (error) {
      throw error;
    }
  }
  // update hotel

  async updateHotelById(id, updateData) {
    try {
      const updateHotel = await this.hotelModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );
      if (!updateHotel) {
        throw new NotFoundException('hotel not found');
      }
      return { message: 'update success', updateHotel: updateHotel };
    } catch (error) {
      throw error;
    }
  }
  // delete by id

  async deleteHotelById(id: string) {
    try {
      const deleteHotel = await this.hotelModel.findByIdAndDelete(id);
      if (!deleteHotel) {
        throw new NotFoundException(
          `hotel with id ${id} not found or not exist, cannot delete`,
        );
      }
      return { message: `delete hotel with id ${id} success` };
    } catch (error) {
      throw error;
    }
  }

  async reviewAndRating(hotelId: string, userId, createReview) {
    try {
      const hotel = await this.hotelModel.findById(hotelId);
      if (!hotel) {
        throw new NotFoundException('cannot find hotel');
      }

      const review = new this.reviewModel({
        ...createReview,
        userId,
        hotelId,
      });
      hotel.reviews.push(review);
      hotel.rateCount = hotel.rateCount + 1;
      hotel.totalRating = hotel.totalRating + createReview.rating;
      hotel.averageRating = parseFloat(
        (hotel.totalRating / hotel.rateCount).toFixed(1),
      );
      await review.save();
      await hotel.save();
      return hotel;
    } catch (error) {
      throw error;
    }
  }

  async getAllHotels(): Promise<Hotel[]> {
    try {
      const listHotels = await this.hotelModel.find();
      if (listHotels.length < 0) {
        throw new NotFoundException('list hotel is null');
      }

      return listHotels;
    } catch (error) {
      throw error;
    }
  }
}
