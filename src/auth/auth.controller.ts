import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('login/patient')
  async patientLogin(@Body() body: { email: string; birthDate: Date }) {
    return this.authService.patientLogin(body.email, body.birthDate);
  }

  @Post('sign-up')
  async signUp(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      isProfessional: boolean;
    },
  ) {
    return this.authService.signUp(body);
  }

  @Get('verify-account')
  async verifyEmail(
    @Query() query: { token: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.verifyAccount(query.token, response);
  }

  @UseGuards(AuthGuard)
  @Get('resend-verification-code')
  async resendVerificationCode(@Req() req) {
    return this.authService.resendVerificationCode(req.user.id);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Request() request) {
    return this.authService.me(request.user.id);
  }
}
