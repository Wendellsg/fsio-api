import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

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
    user: { id: string; email: string; role: string };
  }> {
    // Verificar o email e a senha do usuário (geralmente obtidos a partir de um banco de dados)
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    // Gerar um token JWT
    const token = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      {
        secret: process.env.JWT_SECRET,
      },
    );

    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  async signUp({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
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
      },
    });
  }

  private async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
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
      },
    });
    return user;
  }
}
