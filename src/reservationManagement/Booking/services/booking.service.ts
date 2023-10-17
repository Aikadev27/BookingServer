import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/User.schema';
import { Booking } from '../schema/Booking.schema';
import { Room } from 'src/reservationManagement/Hotel/Room/schema/Room.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Room.name) private roomModel: Model<Room>,
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
  ) {}
  async getBookingHistory(userId: string): Promise<Booking[]> {
    try {
      const findUser = await this.userModel.findById(userId);

      if (!findUser) {
        throw new NotFoundException({ message: 'invalid user' });
      }

      const populatedBookings = await this.bookingModel
        .find({ customer: findUser._id })
        .populate('customer', 'username') // Chọn các trường từ đối tượng User
        .populate('room', 'roomNumber roomType pricePerNight floor')
        .select('userQuantity checkInDate checkOutDate') // Chọn các trường từ đối tượng Room)
        .exec();
      return populatedBookings;
    } catch (error) {
      throw error;
    }
  }

  async getBookingInfoById(id: string): Promise<any> {
    try {
      const booking = await this.bookingModel
        .findById(id)
        .populate('room')
        .populate('customer', 'username email address phoneNumber -_id')
        .select('-createdAt -updatedAt -__v -_id');
      if (!booking) {
        throw new NotFoundException(
          `cannot get booking information with id : ${id}`,
        );
      }
      return booking;
    } catch (error) {
      throw error;
    }
  }

  async reserveRoom(
    userId: string,
    reserveForm,
    roomId: string,
  ): Promise<{ message: string; bookingInfo?: Booking }> {
    try {
      console.log('userId:', userId);
      console.log('form Data:', reserveForm);
      console.log('roomId: ', roomId);

      const room = await this.roomModel.findById(roomId);

      if (!room) {
        throw new NotFoundException(`room with id ${roomId} not founded`);
      }
      const roomStatus = room.bookingStatus;

      if (roomStatus === true) {
        // return { message: `room ${room.roomNumber} has been reserved` };
        throw new NotFoundException(
          `room ${room.roomNumber} has been reserved`,
        );
      }

      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new NotFoundException('user not found');
      }
      room.bookingStatus = true;
      await room.save();
      const checkInDate = new Date(reserveForm.checkInDate);
      const checkInOut = new Date(reserveForm.checkInOut);
      const booking = new this.bookingModel({
        customer: userId,
        room: room,
        checkInDate: checkInDate,
        checkInOut: checkInOut,
        ...reserveForm,
      });

      user.bookingHistory.push(booking);
      await booking.save();
      await user.save();
      return { message: 'reserve room successfully', bookingInfo: booking };
    } catch (error) {
      throw error;
    }
  }
}
