/* eslint-disable @typescript-eslint/no-unused-vars */
// check-permission.middleware.ts
import {
  Injectable,
  NestMiddleware,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/services/user.service';
import { AES, enc } from 'crypto-js';
import {
  EXCLUDED_ROUTES,
  getPermissionNameFromRoute,
} from 'src/utils/helper.utils';
import { UserStatus } from 'src/enum/user-status.enum';

// Assuming you have a service for users

@Injectable()
export class CheckPermissionMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    const routeWithoutId = req.baseUrl.replace(/\/[a-f0-9-]+$/, '/:id');
    const currentPermission = getPermissionNameFromRoute(
      routeWithoutId,
      req.method,
    )
      .toUpperCase()
      .replaceAll('-', '_');

    if (
      EXCLUDED_ROUTES.includes(currentPermission.toUpperCase()) &&
      currentPermission != 'LOGOUT' &&
      currentPermission != 'PUBLIC' &&
      currentPermission != 'BROADCAST'
    ) {
      next();
    } else {
      const authHeader = req.headers.authorization;
      const langHeader = req.headers.lang;
      const currencyHeader = req.headers.currency;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        // try {
        const decryptedToken = AES.decrypt(
          token,
          process.env.ENCRYPTION_KEY_TOKEN,
        ).toString(enc.Utf8);
        const dt = await this.usersService.findSessionToken(token);
        if (
          (currentPermission !== 'PUBLIC' && !dt) ||
          dt?.is_expired === true
        ) {
          throw new UnauthorizedException({
            statusCode: 401,
            message: 'INVALID_TOKEN',
          });
        }
        const decoded = this.jwtService.verify(decryptedToken, {
          secret: process.env.JWT_SECRET,
        });
        const user = await this.usersService.findById(decoded.sub);
        user.lang = langHeader || 'en';
        user.currency = currencyHeader || 'USD';
        const { password, ...others } = user;
        req.user = others;
        req.user.token = token;
        if (user.status === UserStatus.INACTIVE) {
          throw new UnauthorizedException({
            statusCode: 401,
            message: 'UNAUTHORIZED_ACCESS',
          });
        }
        if (
          currentPermission === 'LOGOUT' ||
          currentPermission === 'PUBLIC' ||
          currentPermission === 'BROADCAST' ||
          req.user.roles.name == process.env.MEMBER_ROLE_NAME
        ) {
          next();
        } else {
          if (
            user?.roles?.permissions.some(
              (permission) => permission.name === currentPermission,
            )
          ) {
            next();
          } else {
            throw new ForbiddenException({
              statusCode: 403,
              message: 'UNAUTHORIZED_ACCESS',
            });
          }
        }

        // } catch (error) {
        //   throw new ForbiddenException('Invalid token or permission denied');
        // }
      } else {
        if (currentPermission == 'PUBLIC') {
          next();
        } else {
          throw new UnauthorizedException({
            statusCode: 401,
            message: 'TOKEN_REQUIRED',
          });
        }
      }
    }
  }
}
