import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Room } from '../Room/schema/Room.schema';
import { Location } from './Location.schema';
import { User } from 'src/auth/schemas/User.schema';
import { Review } from './Review.schema';

@Schema({
  timestamps: true,
})
export class Hotel extends Document {
  @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
  ownerId: User;

  @Prop({ required: true })
  nameHotel: string;

  @Prop({ required: true, unique: true })
  emailHotel: string;

  @Prop({
    type: mongoose.Schema.ObjectId,
    ref: 'Location',
    required: true,
  })
  location: Location;

  @Prop({ default: [] })
  featuredImageUrl: string[];

  @Prop()
  desc: string;

  @Prop()
  servicePhoneNumber: string;

  @Prop({ default: 0 })
  rateCount: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalRating: number;

  @Prop([{ type: mongoose.Schema.ObjectId, ref: 'Room' }])
  rooms: Room[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }])
  reviews: Review[];
}
export const HotelSchema = SchemaFactory.createForClass(Hotel);
