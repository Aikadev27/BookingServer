import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ unique: [true, 'duplicate email'] })
  email: string;

  @Prop({ required: true })
  password: string;

  // information of user
  @Prop()
  address: string;

  @Prop()
  sex: boolean;

  @Prop()
  age: number;

  @Prop({ required: [true, 'phone number cannot empty'] })
  phoneNumber: number;

  @Prop({ default: 'client' })
  role: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
