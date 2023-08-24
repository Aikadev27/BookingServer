import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../schemas/User.schema';
import { UserService } from '../services/user.service';
import { RegisterDto } from '../dtos/rigister.dto';
import { Roles } from '../decoretors/role.decorator';
import { RolesGuard } from '../guards/roleGuard.guard';
import { AuthGuard } from '../guards/auth.guard';

@Controller('api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}
  //   findOne User
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('by-identifier/:identifier')
  async findByIdentifier(
    @Param('identifier') identifier: string,
  ): Promise<User> {
    return this.userService.findByNameOrPhoneNumber(identifier);
  }

  //   get All user
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('get-all-user')
  async getAllUser() {
    return await this.userService.getAllUser();
  }
  //   update user

  @Roles('admin', 'client')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('update-user/:username')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Body() updateData: RegisterDto,
    @Param('username') username: string,
  ) {
    return this.userService.updateUser(updateData, username);
  }
  //   delete user by Id
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('delete-user-by-id/:id')
  async deleteById(@Param('id') id: string) {
    return await this.userService.deleteById(id);
  }
  // Find user list by Role

  @Get('by-user-role/:role')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async findListUserByRole(@Param('role') role: string): Promise<User[]> {
    return await this.userService.findListUserByRole(role);
  }
}
