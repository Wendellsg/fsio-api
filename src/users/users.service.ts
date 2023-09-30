import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.email || !createUserDto.password) {
      throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
    }

    const findUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (findUser) {
      throw new HttpException(
        {
          message: 'Email já cadastrado',
        },
        HttpStatus.CONFLICT,
      );
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
      if (error.code === 409) {
        throw new HttpException(
          {
            message: 'Email já cadastrado',
          },
          HttpStatus.CONFLICT,
        );
      }

      if (error.code === 400) {
        throw new HttpException(
          {
            message: 'Email ou senha não informados',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createByDoctor(createUserDto: CreateUserDto) {
    if (!createUserDto.email || !createUserDto.name) {
      throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
    }

    const findUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (findUser) {
      throw new HttpException(
        {
          message: 'Email já cadastrado',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const randomPassword = Math.random().toString(36).slice(-8);

      const encripted = bcrypt.hashSync(randomPassword, 10);

      const user = new this.userModel({
        name: createUserDto.name,
        email: createUserDto.email,
        password: encripted,
      });

      return user.save();
    } catch (error) {
      if (error.code === 409) {
        throw new HttpException(
          {
            message: 'Email já cadastrado',
          },
          HttpStatus.CONFLICT,
        );
      }

      if (error.code === 400) {
        throw new HttpException(
          {
            message: 'Email ou nome não informados',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

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

      delete user.password;

      if (!user)
        return new HttpException(
          {
            message: 'Usuário não encontrado',
          },
          HttpStatus.NOT_FOUND,
        );

      return user;
    } catch (error) {
      console.log(error);

      if (error.status === 404) throw error;

      throw new HttpException(
        {
          message: 'Erro ao buscar usuário',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findPatients(id: string) {
    try {
      const user = await this.userModel.findById(id);

      if (!user) throw new HttpException('Usuário não encontrado', 404);

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

      return patients;
    } catch (error) {
      console.log(error);

      if (error.status === 404) throw error;

      throw new HttpException(
        {
          message: 'Erro ao buscar usuário',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getPatient(patientId: string) {
    try {
      const user = await this.userModel.findById(patientId);

      if (!user) throw new HttpException('Paciente não encontrado', 404);

      delete user.password;
      delete user.patients;
      delete user.resetPasswordToken;
      delete user.professionalLicense;
      delete user.professionalLicenseImage;

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updatePatient(
    userId: string,
    patient: Partial<User>,
    diagnosis: string,
  ) {
    try {
      await this.userModel.findByIdAndUpdate(
        patient._id,
        {
          $set: {
            weight: patient.weight,
            height: patient.height,
          },
        },
        {
          new: true,
        },
      );

      await this.userModel.findOneAndUpdate(
        {
          _id: userId,
          'patients.userId': patient._id,
        },
        {
          $set: {
            'patients.$.diagnosis': diagnosis,
          },
        },
      );

      return {
        message: 'User updated',
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
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
      if (error.status === 404) throw error;

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
      const user = await this.userModel.findById(id);

      if (!user) throw new HttpException('Usuário não encontrado', 404);

      if (user.patients.find((patient) => patient.userId === patientId))
        throw new HttpException(
          'Este Paciente já está em sua lista de pacientes',
          HttpStatus.BAD_REQUEST,
        );

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
      throw error;
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

  async addFavoriteExercise(id: string, exerciseId: string) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        {
          $push: {
            favoriteExercises: exerciseId,
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

  async removeFavoriteExercise(id: string, exerciseId: string) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoriteExercises: exerciseId,
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
