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
import { BulkProductUploadDto } from 'src/dto/product/bulk-product-upload.dto';
import { CreateProductDto } from 'src/dto/product/create-product.dto';
import { SearchProductDto } from 'src/dto/product/search-product.dto';
import { UpdateProductDto } from 'src/dto/product/update-product.dto';
import { ProductInteractionTypeEnum } from 'src/enum/product-interation-type.enum';
import { ProductService } from 'src/services/product.service';
import { RecomService } from 'src/services/recom.service';

@ApiTags('Product Management')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(
    private readonly prodService: ProductService,
    private readonly recomService: RecomService,
  ) {}
  @Post()
  create(@Body(ValidationPipe) req: CreateProductDto, @Request() r) {
    return this.prodService.create(req, r.user);
  }

  @Post('bulk')
  bulk(@Body(ValidationPipe) req: BulkProductUploadDto, @Request() r) {
    return this.prodService.bulk(req, r.user);
  }

  @Get()
  findAll(@Query() req: SearchProductDto) {
    return this.prodService.findAll(req);
  }

  @Get('public/landing-page')
  getPopularProductsOfCurrentMonth(@Request() r) {
    return this.recomService.getLandingPageData(r.user);
  }

  @Get('public')
  public(@Query() req: SearchProductDto) {
    return this.prodService.findAll(req);
  }

  @Get('public/:id')
  findPublic(@Param('id') id: number, @Request() r) {
    return this.prodService.findOne(id, r.user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() r) {
    return this.prodService.findOne(id, r.user);
  }

  @Patch()
  update(
    @Param('id') id: number,
    @Body(ValidationPipe) req: UpdateProductDto,
    @Request() r,
  ) {
    return this.prodService.update(id, req, r.user);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prodService.remove(id);
  }
}
