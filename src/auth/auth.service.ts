import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRoleEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{
    token: string;
  }> {
    // Verificar o email e a senha do usuário (geralmente obtidos a partir de um banco de dados)
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };

    if (user.professional) {
      payload['professionalId'] = user.professional.id;
    }
    // Gerar um token JWT
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return { token };
  }

  async signUp({
    email,
    password,
    name,
    isProfessional,
  }: {
    email: string;
    password: string;
    name: string;
    isProfessional: boolean;
  }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      throw new HttpException('Usuário já existe', HttpStatus.BAD_REQUEST);
    }

    if (password.length < 8) {
      throw new HttpException(
        'Senha deve conter no mínimo 8 caracteres',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        name,
        roles: isProfessional ? [UserRoleEnum.admin] : [UserRoleEnum.patient],
      },
    });
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<
    User & {
      professional?: {
        id: string;
      };
    }
  > {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        professional: true,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          message: 'Usuário não encontrado',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new HttpException(
        {
          message: 'Senha incorreta',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async me(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        email: true,
        name: true,
        id: true,
        image: true,
        roles: true,
      },
    });
    return user;
  }
}
