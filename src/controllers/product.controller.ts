import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Patch,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BulkProductUploadDto } from 'src/dto/product/bulk-product-upload.dto';
import { CreateFeaturesDto } from 'src/dto/product/create-features.dto';
import { CreateProductDto } from 'src/dto/product/create-product.dto';
import { SearchProductDto } from 'src/dto/product/search-product.dto';
import { UpdateFeaturesDto } from 'src/dto/product/update-features.dto';
import { UpdateProductDto } from 'src/dto/product/update-product.dto';
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
  create(@Body() req: CreateProductDto, @Request() r) {
    return this.prodService.create(req, r.user);
  }

  @Post('bulk')
  bulk(@Body() req: BulkProductUploadDto, @Request() r) {
    return this.prodService.bulk(req, r.user);
  }

  @Get()
  findAll(@Query() req: SearchProductDto, @Request() r) {
    return this.prodService.findAll(req, r.user);
  }

  @Get('public/landing-page')
  getPopularProductsOfCurrentMonth(@Request() r) {
    return this.recomService.getLandingPageData(r.user);
  }

  @Get('public')
  public(@Query() req: SearchProductDto, @Request() r) {
    console.log(req.user);
    return this.prodService.findAll(req, r.user);
  }

  @Get('public/:id')
  findPublic(@Param('id') id: number, @Request() r) {
    return this.prodService.findOne(id, r.user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() r) {
    return this.prodService.findOne(id, r.user);
  }

  @Patch('seo-create/:id')
  createSeo(
    @Param('id') id: number,
    @Body() req: CreateFeaturesDto[],
    @Request() r,
  ) {
    return this.prodService.createSeo(id, req, r.user);
  }

  @Patch('image-upload/:id')
  imageUpload(
    @Param('id') id: number,
    @Body() req: CreateFeaturesDto[],
    @Request() r,
  ) {
    return this.prodService.createSeo(id, req, r.user);
  }

  @Patch('image-remove/:id')
  imageDelete(
    @Param('id') id: number,
    @Body() req: CreateFeaturesDto[],
    @Request() r,
  ) {
    return this.prodService.createSeo(id, req, r.user);
  }

  @Patch('seo-update/:id')
  updateSeo(
    @Param('id') id: number,
    @Body() req: UpdateFeaturesDto[],
    @Request() r,
  ) {
    return this.prodService.updateSeo(id, req, r.user);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() req: UpdateProductDto, @Request() r) {
    return this.prodService.update(id, req, r.user);
  }
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prodService.remove(id);
  }
}
