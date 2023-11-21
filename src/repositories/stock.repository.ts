import { InjectRepository } from '@nestjs/typeorm';
import { CreateStockDto } from 'src/dto/stock/create-stock.dto';
import { Stock } from 'src/entities/stock.entity';
import { Repository } from 'typeorm';

export class StockRepository extends Repository<Stock> {
  async createStock(stockDto: CreateStockDto) {
    const stock = new Stock();
    return await this.stRepo.save(stock);
  }
  constructor(
    @InjectRepository(Stock)
    private stRepo: Repository<Stock>,
  ) {
    super(stRepo.target, stRepo.manager, stRepo.queryRunner);
  }
}
