import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from 'src/entities/stock.entity';
import { Repository } from 'typeorm';

export class StockRepository extends Repository<Stock> {
  constructor(
    @InjectRepository(Stock)
    private stRepo: Repository<Stock>,
  ) {
    super(stRepo.target, stRepo.manager, stRepo.queryRunner);
  }
}
