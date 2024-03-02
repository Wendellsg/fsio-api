import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from '@prisma/client';
import { Request } from 'express';

export const ROLE_KEY = 'role';

export const Roles = (...role: UserRoleEnum[]) => SetMetadata(ROLE_KEY, role);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );
    const token = extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_KEY,
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      request['user'] = payload;

      if (!requiredRoles) {
        return true;
      }

      if (requiredRoles) {
        return requiredRoles.includes(payload.role);
      }

      return false;
    } catch {
      throw new UnauthorizedException();
    }
  }
}

function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
