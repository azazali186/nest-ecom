import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
  Query,
  Patch,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCatalogDto } from 'src/dto/catalog/create-catalog.dto';
import { SearchCatalogDto } from 'src/dto/catalog/search-catalog.dto';
import { UpdateCatalogDto } from 'src/dto/catalog/update-catalog.dto';
import { CatalogService } from 'src/services/catalog.service';

@ApiTags('Catalog Management')
@ApiBearerAuth()
@Controller('catalogs')
export class CatalogController {
  constructor(private readonly cpService: CatalogService) {}
  @Post()
  create(@Body(ValidationPipe) req: CreateCatalogDto, @Request() r) {
    return this.cpService.create(req, r.user);
  }
  @Get()
  findAll(@Query() req: SearchCatalogDto) {
    return this.cpService.findAll(req);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cpService.findOne(id);
  }
  @Patch()
  update(@Param('id') id: number, @Body(ValidationPipe) req: UpdateCatalogDto) {
    return this.cpService.update(id, req);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cpService.remove(id);
  }
}
