import { InjectRepository } from '@nestjs/typeorm';
import { CreateStockDto } from 'src/dto/stock/create-stock.dto';
import { Stock } from 'src/entities/stock.entity';
import { Repository } from 'typeorm';
import { ImagesRepository } from './image.repository';
import { TranslationsRepository } from './translation.repository';
import { Inject, forwardRef } from '@nestjs/common';
import { UpdateStockDto } from 'src/dto/stock/update-stock.dto';

export class StockRepository extends Repository<Stock> {
  constructor(
    @InjectRepository(Stock)
    private stRepo: Repository<Stock>,

    @Inject(forwardRef(() => ImagesRepository))
    private imgRepo: ImagesRepository,

    @Inject(forwardRef(() => TranslationsRepository))
    private trRepo: TranslationsRepository,
  ) {
    super(stRepo.target, stRepo.manager, stRepo.queryRunner);
  }

  async createStock(stockDto: CreateStockDto | UpdateStockDto, user) {
    const { sku, images, translations } = stockDto;
    const stock = new Stock();
    stock.sku = sku;
    stock.created_by = user;

    await this.stRepo.save(stock);

    const translationsData = await Promise.all(
      translations.map(async (translationDto) => {
        const translation = await this.trRepo.createTranslation(
          translationDto,
          'stock',
          stock.id,
        );
        return translation;
      }),
    );
    stock.translations = translationsData;

    // Create and associate images
    const imagesData = await Promise.all(
      images.map(async (imageDto) => {
        const image = await this.imgRepo.createImage(
          imageDto,
          'stock',
          stock.id,
        );
        return image;
      }),
    );
    stock.images = imagesData;

    return await this.stRepo.save(stock);
  }

  async updateStock(id: number, stockDto: UpdateStockDto, user: any) {
    const {} = stockDto;
    const stock = await this.stRepo.findOne({ where: { id } });

    stock.updated_by = user;
    await this.stRepo.save(stock);
    return stock;
  }
}
