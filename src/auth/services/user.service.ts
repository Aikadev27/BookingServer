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
      throw error;
    }
  }

  //   getAllUser
  async getAllUser(): Promise<any> {
    return await this.userModel.find().select('-password -__v -bookingHistory');
  }
  // get by Id

  async GetById(id: string): Promise<User> {
    try {
      const findUser = await this.userModel
        .findById(id)
        .select('-password ')
        .exec();

      if (!findUser) {
        throw new NotFoundException(`user with id:${id} not found or exist`);
      }
      return findUser;
    } catch (error) {
      throw error;
    }
  }
  //   update User
  async updateUser(updateData, id) {
    console.log(updateData);

    try {
      const user = await this.userModel.findOneAndUpdate(
        {
          _id: id,
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
      console.log(error);

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
      throw error;
    }
  }

  async findListUserByRole(role: string): Promise<any[]> {
    try {
      const listUser: User[] = await this.userModel
        .find({ role: role })
        .select('-password -__v -bookingHistory');
      if (listUser.length === 0) {
        throw new NotFoundException(
          `list user with role is: ${role} not exist`,
        );
      }
      return [{ totalList: listUser.length }, { data: listUser }];
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
