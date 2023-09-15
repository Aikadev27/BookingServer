import {
  Injectable,
  UnauthorizedException,
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

  // log in
  async Login(loginDto) {
    console.log(loginDto);

    try {
      const user = await this.userModel
        .findOne({
          email: loginDto.email,
        })
        .select('-__v -createdAt -updatedAt');
      if (!user) {
        throw new NotFoundException('email is wrong');
      }
      const isPassword = await bcrypt.compareSync(
        loginDto.password,
        user.password,
      );
      if (!isPassword) {
        throw new UnauthorizedException('password is wrong !!');
      }

      const payload = {
        id: user._id,
        name: user.username,
        role: user.role,
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...info } = user.toJSON();
      const accessToken = await this.jwtService.signAsync(
        { payload: payload },
        { secret: process.env.ACCESS_SECRET, expiresIn: '1d' },
      );
      const refreshToken = await this.jwtService.signAsync(
        { payload: payload },
        { secret: process.env.REFRESH_SECRET, expiresIn: '15d' },
      );

      return {
        info,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.log(error);

      throw error;
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

  // create accessToken
  async generateAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(
      { payload },
      {
        secret: process.env.ACCESS_SECRET,
        expiresIn: '1d',
      },
    );
  }

  // register
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
        return new UnauthorizedException(
          'The account already exists, please choose another account name',
        );
      }
      const isBusinessRole: boolean = registerDto.isBusiness;
      let defaultRole: string = '';
      if (isBusinessRole === false) {
        defaultRole = 'client';
      } else if (isBusinessRole === true) {
        defaultRole = 'business';
      } else {
        defaultRole = registerDto.role;
      }

      const hashPass = await bcrypt.hash(registerDto.password, 10);
      const user = await this.userModel.create({
        ...registerDto,
        password: hashPass,
        role: defaultRole,
      });

      return {
        message: 'create account success',
        userInfo: user,
      };
    } catch (error) {
      console.log(error);

      throw error('register failed');
    }
  }
}
