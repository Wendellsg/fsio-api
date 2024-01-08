import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('sign-up')
  async signUp(
    @Body() body: { email: string; password: string; name: string },
  ) {
    return this.authService.signUp(body);
  }
  /* 
  @UseGuards(AuthGuard)
  @Get('me')
  me(@Request() request) {
    return this.authService.me(request.user.id);
  } */
}
