import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

export class ProductRepository extends Repository<Product> {
  constructor(
    @InjectRepository(Product)
    private prodRepo: Repository<Product>,
  ) {
    super(prodRepo.target, prodRepo.manager, prodRepo.queryRunner);
  }
}
