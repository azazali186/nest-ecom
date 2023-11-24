import { InjectRepository } from '@nestjs/typeorm';
import { PriceDto } from 'src/dto/stock/price.dto';
import { Price } from 'src/entities/price.entity';
import { Repository } from 'typeorm';
import { CurrencyRepository } from './currency.repository';
import { Inject, forwardRef } from '@nestjs/common';
import { Stock } from 'src/entities/stock.entity';
import { Product } from 'src/entities/product.entity';

export class PriceRepository extends Repository<Price> {
  constructor(
    @InjectRepository(Price)
    private prRepo: Repository<Price>,

    @Inject(forwardRef(() => CurrencyRepository))
    private curRepo: CurrencyRepository,
  ) {
    super(prRepo.target, prRepo.manager, prRepo.queryRunner);
  }

  async createPrice(priceDto: PriceDto, stock: Stock) {
    const { price, currency_id } = priceDto;
    const priceData = new Price();
    priceData.price = price;
    const currency = await this.curRepo.findOne({ where: { id: currency_id } });
    priceData.currency = currency;
    priceData.stock = stock;

    await this.prRepo.save(priceData);
    return priceData;
  }
  async createProductPrice(priceDto: PriceDto, stock: Product) {
    const { price, currency_id } = priceDto;
    const priceData = new Price();
    priceData.price = price;
    const currency = await this.curRepo.findOne({ where: { id: currency_id } });
    priceData.currency = currency;
    priceData.product = stock;

    await this.prRepo.save(priceData);
    return priceData;
  }
}
