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
import { RegisterDto } from '../dtos/register.dto';
import { Roles } from '../decoretors/role.decorator';
import { RolesGuard } from '../guards/roleGuard.guard';
import { AuthGuard } from '../guards/auth.guard';

@Controller('api/v1/user')
export class UserController {
  constructor(private userService: UserService) {}
  //   findOne User
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('get-by-identifier/:identifier')
  findByIdentifier(@Param('identifier') identifier: string): Promise<User> {
    return this.userService.findByNameOrPhoneNumber(identifier);
  }

  //   get All user
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Get('get-all-user')
  getAllUser() {
    return this.userService.getAllUser();
  }

  // get user  by Id
  @Get('get-by-id/:id')
  GetById(@Param('id') id: string) {
    return this.userService.GetById(id);
  }

  // Find user list by Role

  @Get('get-by-user-role/:role')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  findListUserByRole(@Param('role') role: string): Promise<User[]> {
    return this.userService.findListUserByRole(role);
  }

  //   update user
  @Roles('admin', 'client')
  @UseGuards(AuthGuard, RolesGuard)
  @Patch('update-user/:id')
  @UsePipes(new ValidationPipe())
  updateUser(@Body() updateData: RegisterDto, @Param('id') id: string) {
    this.userService.updateUser(updateData, id);
  }
  //   delete user by Id
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Delete('delete-user-by-id/:id')
  deleteById(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }
}
