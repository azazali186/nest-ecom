import { APP_FILTER } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { QueryFailedErrorFilter } from 'src/middleware/all-exception.filter';
import { HttpExceptionFilter } from 'src/middleware/http-exception.filter';
import { JwtWebSocketMiddleware } from 'src/middleware/jwt-socket.middlwware';
import { AdminPageRepository } from 'src/repositories/admin-page.repository';
import { CurrencyRepository } from 'src/repositories/currency.repository';
import { LogRepository } from 'src/repositories/log.repository';
import { PermissionRepository } from 'src/repositories/permission.repository';
import { RoleRepository } from 'src/repositories/role.repository';
import { SessionRepository } from 'src/repositories/session.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { AuthService } from 'src/services/auth.service';
import { CurrencyService } from 'src/services/currency.service';
import { JwtAuthService } from 'src/services/jwt-auth.service';
import { LangService } from 'src/services/lang.service';
import { LogService } from 'src/services/log.service';
import { PermissionService } from 'src/services/permission.service';
import { RedisService } from 'src/services/redis.service';
import { RoleService } from 'src/services/role.service';
import { UserService } from 'src/services/user.service';
import { WsCustomService } from 'src/services/ws.service';
import { WsGateway } from 'src/ws/ws.gateway';

export const ImportProviders = [
  LangService,
  {
    provide: APP_FILTER, // Use APP_FILTER token to register global filters
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: QueryFailedErrorFilter,
  },
  JwtService,
  UserService,
  UserRepository,
  RoleRepository,
  SessionRepository,
  PermissionRepository,
  JwtWebSocketMiddleware,
  JwtAuthService,
  WsGateway,
  UserRepository,
  RoleRepository,
  PermissionRepository,
  AdminPageRepository,
  SessionRepository,
  UserService,
  AuthService,
  RoleService,
  PermissionService,
  WsCustomService,
  JwtService,
  LogService,
  LogRepository,
  RedisService,
  CurrencyRepository,
  CurrencyService,
];
