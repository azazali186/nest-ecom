import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSeo } from 'src/dto/create-seo.dto';
import { BulkProductUploadDto } from 'src/dto/product/bulk-product-upload.dto';
import { CreateProductDto } from 'src/dto/product/create-product.dto';
import { SearchProductDto } from 'src/dto/product/search-product.dto';
import { UpdateFeaturesDto } from 'src/dto/product/update-features.dto';
import { UpdateProductDto } from 'src/dto/product/update-product.dto';
import { ProductRepository } from 'src/repositories/product.repository';
import { ApiResponse } from 'src/utils/response.util';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    public prodRepo: ProductRepository,
  ) {}

  create(req: CreateProductDto, user: any) {
    return this.prodRepo.createProduct(req, user);
  }
  async findAll(req: SearchProductDto, user: any) {
    return this.prodRepo.findProducts(req, user);
  }
  findOne(id: number, user: any) {
    return this.prodRepo.getProductId(id, user);
  }

  findDetails(sku: string, user: any) {
    return this.prodRepo.findDetails(sku, user);
  }
  update(id: any, req: UpdateProductDto, user: any) {
    return this.prodRepo.updateProduct(id, req, user);
  }
  async remove(id: number) {
    return await this.prodRepo.deleteProduct(id);
  }

  async bulk(req: BulkProductUploadDto, user: any) {
    return await this.prodRepo.bulkCreate(req, user);
  }
  createSeo(id: number, req: CreateSeo, user: any) {
    return this.prodRepo.createSeo(id, req, user);
  }
  updateSeo(id: number, req: UpdateFeaturesDto[], user: any) {
    return this.prodRepo.updateSeo(id, req, user);
  }

  async findSlug(slug: string) {
    const data = await this.prodRepo.find({
      select: {
        slug: true,
      },
      where: {
        slug: slug,
      },
    });

    return ApiResponse.success(data, 200);
  }
  async findSku(sku: string) {
    const data = await this.prodRepo.find({
      select: {
        sku: true,
      },
      where: {
        sku: sku,
      },
    });

    return ApiResponse.success(data, 200);
  }
}
