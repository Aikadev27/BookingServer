import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/User.schema';
import { Booking } from '../schema/Booking.schema';

@Injectable()
export class BookingService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getBookingHistory(userId: string): Promise<Booking[]> {
    try {
      const findUser = await this.userModel.findById(userId);
      if (!findUser) {
        throw new NotFoundException({ message: 'invalid user' });
      }

      return findUser.bookingHistory;
    } catch (error) {
      throw error;
    }
  }
}
