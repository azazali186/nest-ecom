import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ImportEntities } from 'src/imports/entity.import';
const username = process.env.DB_USERNAME || '';
const password = process.env.DB_PASSWORD || 'Aj189628@';
const dbName = process.env.DB_NAME || 'nest-ecom';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOSTNAME || '192.168.30.98',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: username,
  password: password,
  database: dbName,
  entities: ImportEntities,
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
  logger: 'file',
  dateStrings: ['DATE', 'DATETIME', 'TIMESTAMP'],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
  /* cli: {
    migrationsDir: 'src/database/migrations',
  }, */
};
