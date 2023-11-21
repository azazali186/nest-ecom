import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportControllers } from '../imports/controller.import';
import { ImportProviders } from '../imports/providers.import';
import { ImportEntities } from '../imports/entity.import';

@Module({
  imports: [TypeOrmModule.forFeature(ImportEntities)],
  controllers: ImportControllers,
  providers: ImportProviders,
})
export class CommonModule {}
