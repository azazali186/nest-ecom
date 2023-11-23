import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { FilesController } from 'src/controllers/files.controller';

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [FilesController],
})
export class FilesModules {}
