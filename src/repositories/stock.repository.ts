import { InjectRepository } from '@nestjs/typeorm';
import { CreateStockDto } from 'src/dto/stock/create-stock.dto';
import { Stock } from 'src/entities/stock.entity';
import { Repository } from 'typeorm';
import { ImagesRepository } from './image.repository';
import { TranslationsRepository } from './translation.repository';
import { Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { UpdateStockDto } from 'src/dto/stock/update-stock.dto';
import { PriceRepository } from './price.repository';
import { PriceDto } from 'src/dto/stock/price.dto';
import { UpdatePriceDto } from 'src/dto/stock/update-price.dto';

export class StockRepository extends Repository<Stock> {
  constructor(
    @InjectRepository(Stock)
    private stRepo: Repository<Stock>,

    @Inject(forwardRef(() => ImagesRepository))
    private imgRepo: ImagesRepository,

    @Inject(forwardRef(() => TranslationsRepository))
    private trRepo: TranslationsRepository,

    @Inject(forwardRef(() => PriceRepository))
    private prRepo: PriceRepository,
  ) {
    super(stRepo.target, stRepo.manager, stRepo.queryRunner);
  }

  async createStock(stockDto: CreateStockDto | UpdateStockDto, user) {
    const { sku, images, translations, prices } = stockDto;
    const stock = new Stock();
    stock.sku = sku;
    stock.created_by = user;

    await this.stRepo.save(stock);

    const translationsData = await Promise.all(
      translations.map(async (translationDto: any) => {
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
      images.map(async (imageDto: any) => {
        const image = await this.imgRepo.createImage(
          imageDto,
          'stock',
          stock.id,
        );
        return image;
      }),
    );
    stock.images = imagesData;

    // Create and associate images
    const pricesData = await Promise.all(
      prices.map(async (priceDto: PriceDto) => {
        const image = await this.prRepo.createPrice(priceDto, stock);
        return image;
      }),
    );
    stock.price = pricesData;

    return await this.stRepo.save(stock);
  }

  async updateStock(stockId: number, stockDto: UpdateStockDto, user) {
    try {
      const { sku, images, translations, prices } = stockDto;

      // Fetch the existing stock entry from the database
      const stock = await this.stRepo.findOne({ where: { id: stockId } });

      if (!stock) {
        throw new NotFoundException({
          statusCode: 404,
          message: `INVALID_ID`,
          param: `Stock ${stockId}`,
        });
      }

      // Update the properties of the stock entry
      stock.sku = sku;
      stock.updated_by = user;

      // Save the updated stock entry
      await this.stRepo.save(stock);

      // Update translations
      const updatedTranslations = await Promise.all(
        translations.map(async (translationDto: any) => {
          try {
            // Check if translation exists, if not, create a new one
            if (translationDto.id) {
              const existingTranslation =
                await this.trRepo.updateTranslation(translationDto);
              return existingTranslation;
            } else {
              // Create a new translation
              const newTranslation = await this.trRepo.createTranslation(
                translationDto,
                'stock',
                stock.id,
              );
              return newTranslation;
            }
          } catch (translationError) {
            console.error(
              `Error updating translation: ${translationError.message}`,
            );
            throw translationError; // Rethrow the error
          }
        }),
      );
      stock.translations = updatedTranslations;

      // Update or create images
      const updatedImages = await Promise.all(
        images.map(async (imageDto: any) => {
          try {
            // Check if image exists, if not, create a new one
            if (imageDto.id) {
              const existingImage = await this.imgRepo.updateImage(imageDto);
              return existingImage;
            } else {
              // Create a new image
              const newImage = await this.imgRepo.createImage(
                imageDto,
                'stock',
                stock.id,
              );
              return newImage;
            }
          } catch (imageError) {
            console.error(`Error updating image: ${imageError.message}`);
            throw imageError; // Rethrow the error
          }
        }),
      );
      stock.images = updatedImages;

      // Update or create prices
      const updatedPrices = await Promise.all(
        prices.map(async (priceDto: UpdatePriceDto) => {
          try {
            if (priceDto.id) {
              const existingPrice = await this.prRepo.findOne({
                where: { id: priceDto.id },
              });
              if (existingPrice) {
                existingPrice.price = priceDto.price; // Update as needed
                await this.prRepo.save(existingPrice);
                return existingPrice;
              } else {
                throw new NotFoundException({
                  statusCode: 404,
                  message: `INVALID_ID`,
                  param: `Price ${stockId}`,
                });
              }
            } else {
              const newPrice = await this.prRepo.createPrice(priceDto, stock);
              return newPrice;
            }
          } catch (priceError) {
            console.error(`Error updating price: ${priceError.message}`);
            throw priceError; // Rethrow the error
          }
        }),
      );
      stock.price = updatedPrices;

      // Save the stock entry with the updated associations
      return await this.stRepo.save(stock);
    } catch (error) {
      console.error(`Error updating stock: ${error.message}`);
      throw error; // Rethrow the error
    }
  }
}
