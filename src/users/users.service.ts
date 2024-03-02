import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    if (!createUserDto.email || !createUserDto.name) {
      throw new HttpException(
        'Email e nome são obrigatórios',
        HttpStatus.BAD_REQUEST,
      );
    }

    const findUser = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (findUser) {
      throw new HttpException(
        'Usuário já cadastrado com este email',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      if (!createUserDto.password) {
        // random password
        createUserDto.password = Math.random().toString(36).slice(-8);
      }

      const encripted = bcrypt.hashSync(createUserDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: encripted,
        },
      });

      return user;
    } catch (error) {
      throw new HttpException(
        'Erro ao criar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    user.password = '';
    user.resetPasswordToken = '';
    return {
      message: 'Usuário encontrado',
      data: user,
    };
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, image: true },
    });
    return user;
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    delete updateUserDto.password;
    delete updateUserDto.email;
    delete updateUserDto.resetPasswordToken;

    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          ...updateUserDto,
        },
      });

      return {
        message: 'User updated',
        data: updatedUser,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Erro ao atualizar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addFavoriteExercise(id: string, exerciseId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
      include: {
        favoriteExercises: true,
      },
    });

    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    if (user.favoriteExercises.find((exercise) => exercise.id === exerciseId))
      throw new HttpException(
        'Exercício já adicionado aos favoritos',
        HttpStatus.BAD_REQUEST,
      );

    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          favoriteExercises: {
            connect: {
              id: exerciseId,
            },
          },
        },
      });

      return {
        message: 'User updated',
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao adicionar exercício favorito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeFavoriteExercise(id: string, exerciseId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
        include: {
          favoriteExercises: true,
        },
      });

      if (!user)
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      const updatedUser = await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          favoriteExercises: {
            disconnect: {
              id: exerciseId,
            },
          },
        },
      });

      return {
        message: 'User updated',
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao remover exercício favorito',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: {
          id,
        },
      });
      return {
        message: 'Usuário removido com sucesso',
      };
    } catch (error) {
      throw new HttpException(
        'Erro ao remover usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
