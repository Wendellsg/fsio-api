import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
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
      },
    );

    return token;
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

    if (!(await compare(password, user.password))) {
      throw new HttpException(
        {
          message: 'Senha incorreta',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return null;
  }

  async me(id: string) {
    const user = await this.usersService.findOne(id);
    return user;
  }
}
