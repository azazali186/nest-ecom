import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CheckPermissionMiddleware } from './middleware/check-permission.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ImportControllers } from './imports/controller.import';
import { ImportProviders } from './imports/providers.import';
import { ImportEntities } from './imports/entity.import';
import { LoggerMiddleware } from './middleware/logger.middleware';
import * as expressUserAgent from 'express-useragent';
import { i18nConfig } from './config/i18n.config';
import { I18nModule } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot(i18nConfig),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature(ImportEntities),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET',
      signOptions: { expiresIn: '10d' },
    }),
  ],
  controllers: ImportControllers,
  providers: ImportProviders,
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        expressUserAgent.express(),
        CheckPermissionMiddleware,
        LoggerMiddleware,
      )
      .forRoutes('*'); // This applies the middleware to all routes.
  }
}
