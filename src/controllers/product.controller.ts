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
import { CreateProductDto } from 'src/dto/product/create-product.dto';
import { SearchProductDto } from 'src/dto/product/search-product.dto';
import { UpdateProductDto } from 'src/dto/product/update-product.dto';
import { ProductService } from 'src/services/product.service';

@ApiTags('Product Management')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly catService: ProductService) {}
  @Post()
  create(@Body(ValidationPipe) req: CreateProductDto) {
    return this.catService.create(req);
  }
  @Get()
  findAll(@Query() req: SearchProductDto) {
    return this.catService.findAll(req);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.catService.findOne(id);
  }
  @Patch()
  update(@Param('id') id: number, @Body(ValidationPipe) req: UpdateProductDto) {
    return this.catService.update(id, req);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.catService.remove(id);
  }
}
