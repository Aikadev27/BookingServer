import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../schemas/User.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  //   findOne User
  async findByNameOrPhoneNumber(identifier: string): Promise<User> {
    try {
      identifier = identifier.trim();
      const user = await this.userModel.findOne({
        $or: [{ username: identifier }, { phoneNumber: identifier }],
      });

      if (!user) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'User not found !',
        });
      }
      return user;
    } catch (error) {
      throw new Error();
    }
  }

  //   getAllUser
  async getAllUser(): Promise<any> {
    return await this.userModel.find();
  }
  //   update User
  async updateUser(updateData, username) {
    console.log(updateData);

    try {
      const user = await this.userModel.findOneAndUpdate(
        {
          username: username,
        },
        updateData,
        { new: true },
      );
      if (user === null || user === undefined) {
        throw new NotFoundException(
          `User with username '${updateData.username}' not found`,
        );
      }
      return { message: 'update success' };
    } catch (error) {
      throw error;
    }
  }

  //   delete by id

  async deleteById(id) {
    try {
      const result = await this.userModel.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        throw new NotFoundException(`User with ID '${id}' not found`);
      }
      return { message: 'delete user success' };
    } catch (error) {
      throw new error();
    }
  }
}
