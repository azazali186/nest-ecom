import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
  Request,
  Body,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/services/files.service';
import { ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadFileDto } from 'src/dto/images/upload-file.dto';
import { multerConfig } from 'src/config/multer.config';

@ApiTags('Files Management')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadFile(@UploadedFile() files: Express.Multer.File[], @Request() r) {
    console.log(r.files);
    return await this.filesService.uploadFile(r.files, r.user);
  }

  @Get()
  async getAllFiles() {
    return await this.filesService.getAllFiles();
  }

  @Get(':id')
  async getFileById(@Param('id') id: number, @Res() res) {
    const file = await this.filesService.getFileById(id);
    res.sendFile(file.url, { root: 'uploads' }); // Assuming files are stored in the 'uploads' directory
  }

  @Delete()
  async deleteFiles(@Body() body: { ids: number[] }): Promise<void> {
    await this.filesService.deleteFiles(body.ids);
  }
}
