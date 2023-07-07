import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async login(email: string, password: string): Promise<string> {
    // Verificar o email e a senha do usuário (geralmente obtidos a partir de um banco de dados)
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Gerar um token JWT
    const token = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      },
    );

    return token;
  }

  private async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException(
        {
          message: 'Usuário não encontrado',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!(await compare(password, user.password))) {
      throw new HttpException(
        {
          message: 'Senha incorreta',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user && (await compare(password, user.password))) {
      // Retorna o usuário se válido
      return user;
    }

    return null;
  }

  async me(id: string) {
    const user = await this.usersService.findOne(id);
    return user;
  }
}
