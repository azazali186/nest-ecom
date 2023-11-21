import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  create(req: CreateProductDto, user) {
    return this.prodRepo.createProduct(req, user);
  }
  async findAll(req: SearchProductDto) {
    return this.prodRepo.findProducts(req);
  }
  findOne(id: number) {
    return this.prodRepo.getProductId(id);
  }
  update(id: any, req: UpdateProductDto) {
    return this.prodRepo.updateProduct(id, req);
  }
  async remove(id: number) {
    return await this.prodRepo.deleteProduct(id);
  }
}
