import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageController } from 'src/controllers/image.controller';
import { Images } from 'src/entities/images.entity';
import { ImagesRepository } from 'src/repositories/image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Images])],
  controllers: [ImageController],
  providers: [ImagesRepository],
  exports: [ImagesRepository],
})
export class ImagesModule {}
