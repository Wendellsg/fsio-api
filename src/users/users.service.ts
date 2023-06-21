import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  create(createUserDto: CreateUserDto) {
    if (!createUserDto.email || !createUserDto.password) {
      throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
    }

    try {
      const encripted = bcrypt.hashSync(createUserDto.password, 10);

      const user = new this.userModel({
        name: createUserDto.name,
        email: createUserDto.email,
        password: encripted,
      });

      return user.save();
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateProfileImage(userId: string, profileImage: string) {
    if (!profileImage)
      throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);

    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            image: profileImage,
          },
        },
        {
          new: true,
        },
      );

      return {
        message: 'User updated',
        user: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return this.userModel.find();
  }

  findAllByDoctor(doctorId: string) {
    return this.userModel.find({ doctor: doctorId });
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    delete updateUserDto.password;
    delete updateUserDto.email;

    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateUserDto,
        {
          new: true,
        },
      );

      return {
        message: 'User updated',
        user: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
