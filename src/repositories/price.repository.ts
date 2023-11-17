import { InjectRepository } from '@nestjs/typeorm';
import { Price } from 'src/entities/price.entity';
import { Repository } from 'typeorm';

export class PriceRepository extends Repository<Price> {
  constructor(
    @InjectRepository(Price)
    private prRepo: Repository<Price>,
  ) {
    super(prRepo.target, prRepo.manager, prRepo.queryRunner);
  }
}
