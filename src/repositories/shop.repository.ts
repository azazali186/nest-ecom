import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from 'src/entities/shop.entity';
import { Repository } from 'typeorm';

export class ShopRepository extends Repository<Shop> {
  constructor(
    @InjectRepository(Shop)
    private shopRepo: Repository<Shop>,
  ) {
    super(shopRepo.target, shopRepo.manager, shopRepo.queryRunner);
  }
}
