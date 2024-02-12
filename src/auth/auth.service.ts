import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject('USERS_REPOSITORY') private usersRepository: Repository<User>,
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
    return await this.usersService.create({
      email,
      password,
      name,
    });
  }

  private async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
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
    const user = await this.usersService.findOne(id);
    return user;
  }
}
