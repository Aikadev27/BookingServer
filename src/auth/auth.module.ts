import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { User, UserSchema } from './schemas/User.schema';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
