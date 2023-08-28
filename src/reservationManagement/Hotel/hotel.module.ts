import { Module } from '@nestjs/common';
import { RoomModule } from './Room/room.module';
import { HotelController } from './controllers/hotel.controller';
import { HotelService } from './services/hotel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from './schema/Hotel.schema';
import { Location, LocationSchema } from './schema/Location.schema';
import { LocationService } from './services/location.service';
import { User, UserSchema } from 'src/auth/schemas/User.schema';
import { JwtModule } from '@nestjs/jwt';
import { Review, ReviewSchema } from './schema/Review.schema';

@Module({
  imports: [
    RoomModule,
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
    }),
  ],
  controllers: [HotelController],
  providers: [HotelService, LocationService],
})
export class HotelModule {}
