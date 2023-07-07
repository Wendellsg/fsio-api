import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Patient, User } from './entities/user.entity';
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

  async findOne(id: string) {
    try {
      const user = await this.userModel.findById(id);

      user.password = undefined;

      if (!user)
        throw new HttpException(
          {
            message: 'Usuário não encontrado',
          },
          HttpStatus.NOT_FOUND,
        );

      const patients = await Promise.all(
        user.patients.map(async (patient) => {
          const patientData = await this.userModel.findById(patient.userId);
          return {
            _id: patientData._id.toString(),
            image: patientData.image,
            name: patientData.name,
            email: patientData.email,
          };
        }),
      );

      user.patients = patients as unknown as Patient[];

      return user;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao buscar usuário',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user)
        throw new HttpException(
          {
            message: 'Usuário não encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      return user;
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao buscar usuário',
        },
        HttpStatus.NOT_FOUND,
      );
    }
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

  async addPatient(id: string, patientId: string) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        {
          $push: {
            patients: {
              userId: patientId,
            },
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

  async removePatient(id: string, patientId: string) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            patients: {
              userId: patientId,
            },
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

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
