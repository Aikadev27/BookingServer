import {
  Injectable,
  UnauthorizedException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/User.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // dang nhap
  async Login(loginDto) {
    try {
      const user = await this.userModel.findOne({
        email: loginDto.email,
      });
      if (!user) {
        throw new NotFoundException('not found user');
      }
      const isPassword = await bcrypt.compareSync(
        loginDto.password,
        user.password,
      );
      if (!isPassword) {
        throw new UnauthorizedException('password is wrong !!');
      }

      const payload = {
        sub: user._id,
        name: user.username,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(
        { payload: payload },
        { secret: process.env.ACCESS_SECRET, expiresIn: '1d' },
      );
      const refreshToken = await this.jwtService.signAsync(
        { payload: payload },
        { secret: process.env.REFRESH_SECRET, expiresIn: '15d' },
      );

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      console.log(error);
    }
  }

  // refresh token
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });

      const newAccessToken = await this.generateAccessToken(decoded.payload);
      return newAccessToken;
    } catch (error) {
      throw new NotFoundException('Invalid refresh token');
    }
  }

  // tao accessToken
  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(
      { payload },
      {
        secret: process.env.ACCESS_SECRET,
        expiresIn: '1d',
      },
    );
  }

  // dang ky
  async Register(registerDto): Promise<any> {
    try {
      const findUser = await this.userModel.findOne({
        username: registerDto.username,
        email: registerDto.email,
      });
      if (
        findUser &&
        (findUser.username === registerDto.username ||
          findUser.email === registerDto.email)
      ) {
        return new UnauthorizedException('invalid user');
      }

      const hashPass = await bcrypt.hash(registerDto.password, 10);
      const user = await this.userModel.create({
        ...registerDto,
        password: hashPass,
      });

      return {
        status: HttpStatus.OK,
        message: 'create user success',
        userInfo: user,
      };
    } catch (error) {
      console.log(error);

      throw new Error('register failed');
    }
  }
}
