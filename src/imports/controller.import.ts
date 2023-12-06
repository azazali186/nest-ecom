import { AdminPageController } from 'src/controllers/admin-page.controller';
import { AuthController } from 'src/controllers/auth.controller';
import { BroadcastingController } from 'src/controllers/broadcasting.controller';
import { CatalogController } from 'src/controllers/catalogue.controller';
import { CategoryController } from 'src/controllers/category.controller';
import { CurrencyController } from 'src/controllers/currency.controller';
import { FilesController } from 'src/controllers/files.controller';
import { LanguageController } from 'src/controllers/language.controller';
import { LogController } from 'src/controllers/log.controller';
import { PermissionsController } from 'src/controllers/permission.controller';
import { ProductController } from 'src/controllers/product.controller';
import { RoleController } from 'src/controllers/role.controller';
import { UserController } from 'src/controllers/user.controller';

export const ImportControllers = [
  AuthController,
  UserController,
  RoleController,
  PermissionsController,
  LogController,
  BroadcastingController,
  CurrencyController,
  CategoryController,
  LanguageController,
  ProductController,
  FilesController,
  CatalogController,
  AdminPageController,
];
