import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import { Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { CreateRoutineDto } from './dto/create-routine-dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Activity } from './entities/activity.entity';
import { FrequencyType, PeriodType, Routine } from './entities/routine.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('EXERCISES_REPOSITORY')
    private exerciseRepository: Repository<Exercise>,
    @Inject('ROUTINES_REPOSITORY')
    private routineRepository: Repository<Routine>,
    @Inject('ACTIVITIES_REPOSITORY')
    private activityRepository: Repository<Activity>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.email || !createUserDto.password) {
      throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
    }

    const findUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
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

      const user = this.userRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: encripted,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);

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

    const findUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
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

      const user = this.userRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: encripted,
      });

      return await this.userRepository.save(user);
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
      const updatedUser = await this.userRepository.update(userId, {
        image: profileImage,
      });

      return {
        message: 'User updated',
        user: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    try {
      if (!id || id === 'undefined')
        throw new HttpException(
          {
            message: 'Usuário não encontrado',
          },
          HttpStatus.NOT_FOUND,
        );

      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });

      delete user.password;
      delete user.patients;
      delete user.resetPasswordToken;
      delete user.routines;

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
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
        relations: ['patients'],
      });

      if (!user) throw new HttpException('Usuário não encontrado', 404);

      return user.patients.map((patient) => {
        delete patient.password;
        delete patient.resetPasswordToken;
        delete patient.professionalLicense;
        delete patient.professionalLicenseImage;
        return patient;
      });
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

  async findUserProfessionals(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
        select: {
          professionals: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        relations: ['professionals'],
      });

      if (!user) throw new HttpException('Usuário não encontrado', 404);

      return user.professionals;
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
      if (!patientId || patientId === 'undefined')
        throw new HttpException(
          {
            message: 'Usuário não encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      const user = await this.userRepository.findOne({
        where: {
          id: patientId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          weight: true,
          height: true,
          routines: {
            activities: true,
            exercise: {
              id: true,
              name: true,
              description: true,
              image: true,
            },
            id: true,
            description: true,
            frequency: true,
            frequencyType: true,
            period: true,
            repetitions: true,
            series: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        relations: ['routines', 'routines.activities', 'routines.exercise'],
      });

      if (!user) throw new HttpException('Paciente não encontrado', 404);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updatePatient(patient: Partial<User>) {
    try {
      await this.userRepository.update(patient.id, {
        weight: patient.weight,
        height: patient.height,
      });

      return {
        message: 'User updated',
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user)
        throw new HttpException(
          {
            message: 'Usuário não encontrado',
          },
          HttpStatus.NOT_FOUND,
        );

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
      return payload;
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
      const updatedUser = await this.userRepository.update(id, updateUserDto);

      return {
        message: 'User updated',
        user: updatedUser,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addPatient(id: string, patientId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
        relations: ['patients'],
      });

      if (!user) throw new HttpException('Usuário não encontrado', 404);

      if (user.patients.find((patient) => patient.id === patientId))
        throw new HttpException(
          'Este Paciente já está em sua lista de pacientes',
          HttpStatus.BAD_REQUEST,
        );

      const patient = await this.userRepository.findOne({
        where: {
          id: patientId,
        },
        relations: ['professionals'],
      });

      if (!patient) throw new HttpException('Paciente não encontrado', 404);
      user.patients.push(patient);

      const updatedUser = await this.userRepository.save(user);

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
      // Carregar o usuário com seus pacientes
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
        relations: ['patients'],
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Encontrar o paciente que precisa ser removido
      const patientToRemove = user.patients.find(
        (patient) => patient.id === patientId,
      );

      if (!patientToRemove) {
        throw new Error('Patient not found');
      }

      // Remover o paciente da lista de pacientes
      user.patients = user.patients.filter(
        (patient) => patient.id !== patientId,
      );

      // Salvar o usuário
      const updatedUser = await this.userRepository.save(user);

      return {
        message: 'User updated',
        user: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async addFavoriteExercise(id: string, exerciseId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    if (user.favoriteExercises.find((exercise) => exercise.id === exerciseId))
      throw new HttpException(
        'Este exercício já está em sua lista de favoritos',
        HttpStatus.BAD_REQUEST,
      );

    const exercise = await this.exerciseRepository.findOne({
      where: {
        id: exerciseId,
      },
    });

    try {
      const updatedUser = await this.userRepository.update(id, {
        favoriteExercises: [...user.favoriteExercises, exercise],
      });

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
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });

      const updatedUser = await this.userRepository.update(id, {
        favoriteExercises: user.favoriteExercises.filter(
          (exercise) => exercise.id !== exerciseId,
        ),
      });

      return {
        message: 'User updated',
        user: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createRoutine(
    id: string,
    routine: CreateRoutineDto,
    professionalId: string,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!user) throw new HttpException('Usuário não encontrado', 404);

      const professional = await this.userRepository.findOne({
        where: {
          id: professionalId,
        },
      });

      if (!professional)
        throw new HttpException('Profissional não encontrado', 404);

      const exercise = await this.exerciseRepository.findOne({
        where: {
          id: routine.exerciseId,
        },
      });

      if (!exercise) throw new HttpException('Exercício não encontrado', 404);

      const newRoutine = this.routineRepository.create({
        professional,
        user,
        exercise,
        description: routine.description,
        frequency: routine.frequency,
        frequencyType: FrequencyType[routine.frequencyType],
        period: PeriodType[routine.period],
        repetitions: routine.repetitions,
        series: routine.series,
      });

      await this.routineRepository.save(newRoutine);

      return {
        message: 'User updated',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getRoutines(userId: string) {
    console.log('userId', userId);

    try {
      const routines = await this.routineRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
        select: {
          id: true,
          description: true,
          frequency: true,
          frequencyType: true,
          period: true,
          repetitions: true,
          series: true,
          exercise: {
            id: true,
            name: true,
            description: true,
            image: true,
          },
          professional: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        relations: ['exercise', 'professional', 'activities'],
      });

      return routines;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateRoutine(
    id: string,
    routineId: string,
    routine: CreateRoutineDto,
  ) {
    try {
      const updatedUser = await this.routineRepository.update(routineId, {
        ...routine,
      });

      return {
        message: 'User updated',
        user: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createActivity(
    id: string,
    routineId: string,
    createActivityDto: CreateActivityDto,
  ) {
    try {
      const routine = await this.routineRepository.findOne({
        where: {
          id: routineId,
        },
      });

      if (!routine) throw new HttpException('Rotina não encontrada', 404);

      const newActivity = this.activityRepository.create({
        ...createActivityDto,
        routine,
      });

      await this.activityRepository.save(newActivity);

      return {
        message: 'User updated',
        user: newActivity,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
