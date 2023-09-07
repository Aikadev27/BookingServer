import { Module } from '@nestjs/common';
import { RoomController } from './controllers/room.controller';
import { RoomService } from './services/room.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schema/Room.schema';
import { JwtModule } from '@nestjs/jwt';
import { Hotel, HotelSchema } from '../schema/Hotel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
    }),
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
