import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserRoleEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import PlaidResetPasswordEmail from 'src/emails/forgotPassword';
import { PlaidVerifyIdentityEmail } from 'src/emails/verificationCode';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailService,
    private readonly configService: ConfigService,
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
      accountVerified: user.accountVerifiedAt ? true : false,
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
      throw new HttpException(
        'Já existe uma conta cadastrada com esse email',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password.length < 8) {
      throw new HttpException(
        'Senha deve conter no mínimo 8 caracteres',
        HttpStatus.BAD_REQUEST,
      );
    }
    const accountVerifyToken = crypto.randomUUID();

    const BACKEND_URL = this.configService.get('BACKEND_URL');

    const url = `${BACKEND_URL}/auth/verify-account?token=${accountVerifyToken}`;

    await this.prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        name,
        roles: isProfessional
          ? [UserRoleEnum.professional]
          : [UserRoleEnum.patient],
        accountVerifyToken: accountVerifyToken,
      },
    });

    await this.mailerService.sendMail({
      email: email,
      subject: 'Verificação de conta',
      template: PlaidVerifyIdentityEmail({
        url: url,
      }),
    });

    return {
      message: 'Usuário criado com sucesso',
    };
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

  async resendVerificationCode(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const accountVerifyToken = crypto.randomUUID();

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        accountVerifyToken,
      },
    });

    const BACKEND_URL = this.configService.get('BACKEND_URL');

    const url = `${BACKEND_URL}/auth/verify-account?token=${accountVerifyToken}`;

    await this.mailerService.sendMail({
      email: user.email,
      subject: 'Verificação de conta',
      template: PlaidVerifyIdentityEmail({
        url: url,
      }),
    });

    return {
      message: 'Email enviado com sucesso',
    };
  }

  async verifyAccount(token: string, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        accountVerifyToken: token,
      },
    });

    const FRONTEND_URL = this.configService.get('FRONTEND_URL');

    if (!user) {
      res.redirect(`${FRONTEND_URL}/errors?error=invalid-token`);
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        accountVerifyToken: null,
        accountVerifiedAt: new Date(),
      },
    });

    return res.redirect(`${FRONTEND_URL}/login`);
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    const resetPasswordToken = crypto.randomUUID();

    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        resetPasswordToken,
      },
    });

    const frontEndUrl = this.configService.get('FRONTEND_URL');

    await this.mailerService.sendMail({
      email: email,
      subject: 'Redefinição de senha',
      template: PlaidResetPasswordEmail({
        url: `${frontEndUrl}/reset-password?token=${resetPasswordToken}`,
      }),
    });

    return {
      message: 'Email enviado com sucesso',
    };
  }

  async resetPassword(token: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        resetPasswordToken: token,
      },
    });

    if (!user) {
      throw new HttpException('Token inválido', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await bcrypt.hash(password, 10),
        resetPasswordToken: null,
      },
    });

    return {
      message: 'Senha alterada com sucesso',
    };
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
        accountVerifiedAt: true,
      },
    });
    return user;
  }
}
