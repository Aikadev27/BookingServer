import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refreshToken.dto';
import { RegisterDto } from '../dtos/rigister.dto';

import { AuthService } from '../services/auth.service';
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // login
  @Post('login')
  Login(@Body() loginDto: LoginDto) {
    return this.authService.Login(loginDto);
  }

  // refresh token
  @Post('refreshToken')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<any> {
    const newAccessToken = await this.authService.refreshAccessToken(
      refreshTokenDto.refreshToken,
    );
    return { accessToken: newAccessToken };
  }
  // register/signup
  @Post('register')
  @UsePipes(new ValidationPipe())
  async Register(@Body() registerDto: RegisterDto) {
    // console.log(registerDto);

    return this.authService.Register(registerDto);
  }
}
