import { AdminPage } from 'src/entities/admin-page.entity';
import { Currency } from 'src/entities/currency.entity';
import { Language } from 'src/entities/language.entity';
import { Log } from 'src/entities/log.entity';
import { Permission } from 'src/entities/permission.entity';
import { Role } from 'src/entities/role.entity';
import { Session } from 'src/entities/session.entity';
import { User } from 'src/entities/user.entity';

export const ImportEntities = [
  Language,
  Currency,
  User,
  Role,
  Permission,
  AdminPage,
  Log,
  Session,
  // Images,
  // Product,
  // Category,
  // Translations,
  // Price,
];
