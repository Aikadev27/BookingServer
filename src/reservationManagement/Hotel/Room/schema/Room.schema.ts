import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Hotel } from '../../schema/Hotel.schema';

@Schema({
  timestamps: true,
})
export class Room extends Document {
  // so phong
  @Prop()
  roomNumber: string;

  //   loai phong: don, doi ....
  @Prop()
  roomType: string;

  //   mo ta cua phong
  @Prop()
  desc: string;

  //   gia 1 dem
  @Prop()
  pricePerNight: number;

  //   tang
  @Prop()
  floor: number;

  //   tinh trang : da dat hay chua ?
  @Prop()
  bookingStatus: boolean;

  //   phong thuoc khach san nao`
  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Hotel' })
  hotelId: Hotel;
}
export const RoomSchema = SchemaFactory.createForClass(Room);
