import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BulkProductUploadDto } from 'src/dto/product/bulk-product-upload.dto';
import { CreateProductDto } from 'src/dto/product/create-product.dto';
import { SearchProductDto } from 'src/dto/product/search-product.dto';
import { UpdateProductDto } from 'src/dto/product/update-product.dto';
import { ProductRepository } from 'src/repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    public prodRepo: ProductRepository,
  ) {}

  create(req: CreateProductDto, user: any) {
    return this.prodRepo.createProduct(req, user);
  }
  async findAll(req: SearchProductDto) {
    return this.prodRepo.findProducts(req);
  }
  findOne(id: number, user: any) {
    return this.prodRepo.getProductId(id, user);
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
}
