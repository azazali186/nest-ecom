import { AuthController } from 'src/controllers/auth.controller';
import { BroadcastingController } from 'src/controllers/broadcasting.controller';
import { LogController } from 'src/controllers/log.controller';
import { PermissionsController } from 'src/controllers/permission.controller';
import { RoleController } from 'src/controllers/role.controller';
import { UserController } from 'src/controllers/user.controller';

export const ImportControllers = [
  AuthController,
  UserController,
  RoleController,
  PermissionsController,
  LogController,
  BroadcastingController,
];
