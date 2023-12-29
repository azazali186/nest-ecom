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
  CHECK_LOGIN_ROUTES,
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
    let routeWithoutId = req.baseUrl.replace(/\/[a-f0-9-]+$/, '/:id');
    if (routeWithoutId.includes('/api/v1/products/sku')) {
      routeWithoutId = '/api/v1/products/sku/:sku';
    }
    if (routeWithoutId.includes('/api/v1/products/slug')) {
      routeWithoutId = '/api/v1/products/slug/:slug';
    }
    // console.log('req', req);
    const currentPermission = getPermissionNameFromRoute(
      routeWithoutId,
      req.method,
    )
      .toUpperCase()
      .replaceAll('-', '_');

    if (EXCLUDED_ROUTES.includes(currentPermission.toUpperCase())) {
      next();
    } else {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        const dt = await this.usersService.findSessionToken(token);
        if (!dt || dt.is_expired === true) {
          throw new UnauthorizedException({
            statusCode: 401,
            message: 'INVALID_TOKEN',
          });
        }
        // try {
        const decryptedToken = AES.decrypt(
          token,
          process.env.ENCRYPTION_KEY_TOKEN,
        ).toString(enc.Utf8);
        let decoded = null;
        try {
          decoded = await this.jwtService.verify(decryptedToken, {
            secret: process.env.JWT_SECRET,
          });
        } catch (error) {
          await this.usersService.updateExpireInToken(token);
          throw new UnauthorizedException({
            statusCode: 401,
            message: 'INVALID_TOKEN',
          });
        }
        const user = await this.usersService.findById(decoded.sub);
        // console.log('user  ', decoded);
        const { password, ...others } = user;
        req.user = others;
        req.user.token = token;
        if (user.status === UserStatus.INACTIVE) {
          throw new UnauthorizedException({
            statusCode: 401,
            message: 'UNAUTHORIZED_ACCESS',
          });
        }
        if (CHECK_LOGIN_ROUTES.includes(currentPermission)) {
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
              cause: currentPermission,
            });
          }
        }

        // } catch (error) {
        //   throw new ForbiddenException('Invalid token or permission denied');
        // }
      } else {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'TOKEN_REQUIRED',
          error: {
            currentPermission: currentPermission,
          },
        });
      }
    }
  }
}
