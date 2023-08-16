import { Roles } from '../decoretors/role.decorator';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refreshToken.dto';
import { RegisterDto } from '../dtos/rigister.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roleGuard.guard';

import { AuthService } from '../services/auth.service';
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Req,
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
    return this.authService.Register(registerDto);
  }

  @Roles('admin', 'super')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('test-guard')
  testGuard(@Req() { user }) {
    console.log('passed all  guard');
    return user;
  }
}
