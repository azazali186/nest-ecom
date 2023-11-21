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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BulkCreateCategoryDto } from 'src/dto/category/bulk-product-upload.dto';
import { CreateCategoryDto } from 'src/dto/category/create-category.dto';
import { SearchCategoryDto } from 'src/dto/category/search-category.dto';
import { UpdateCategoryDto } from 'src/dto/category/update-category.dto';
import { CategoryService } from 'src/services/category.service';

@ApiTags('Category Management')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly catService: CategoryService) {}
  @Post()
  create(@Body(ValidationPipe) req: CreateCategoryDto) {
    return this.catService.create(req);
  }

  @Post('bulk')
  bulk(@Body(ValidationPipe) req: BulkCreateCategoryDto) {
    return this.catService.bulk(req);
  }

  @Get('public')
  public(@Query() req: SearchCategoryDto) {
    return this.catService.findAll(req);
  }

  @Get()
  findAll(@Query() req: SearchCategoryDto) {
    return this.catService.findAll(req);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.catService.findOne(id);
  }
  @Patch()
  update(
    @Param('id') id: number,
    @Body(ValidationPipe) req: UpdateCategoryDto,
  ) {
    return this.catService.update(id, req);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.catService.remove(id);
  }
}
