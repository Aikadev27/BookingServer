/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { BookingController } from './controllers/booking.controller';
import { BookingService } from './services/booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schema/Booking.schema';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/auth/schemas/User.schema';
import { Room, RoomSchema } from '../Hotel/Room/schema/Room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
    }),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
