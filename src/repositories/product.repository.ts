import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/dto/product/create-product.dto';
import { SearchProductDto } from 'src/dto/product/search-product.dto';
import { UpdateProductDto } from 'src/dto/product/update-product.dto';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

export class ProductRepository extends Repository<Product> {
  createProduct(req: CreateProductDto) {
    throw new Error('Method not implemented.');
  }
  findProducts(req: SearchProductDto) {
    throw new Error('Method not implemented.');
  }
  getProductId(id: number) {
    throw new Error('Method not implemented.');
  }
  updateProduct(id: any, req: UpdateProductDto) {
    throw new Error('Method not implemented.');
  }
  deleteProduct(id: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Product)
    private prodRepo: Repository<Product>,
  ) {
    super(prodRepo.target, prodRepo.manager, prodRepo.queryRunner);
  }
}
