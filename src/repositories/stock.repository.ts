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
import { Variation } from 'src/entities/variations.entity';
import { UserRepository } from './user.repository';

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

    @Inject(forwardRef(() => UserRepository))
    private userRepo: UserRepository,
  ) {
    super(stRepo.target, stRepo.manager, stRepo.queryRunner);
  }

  async createStock(
    stockDto: CreateStockDto | UpdateStockDto,
    user: any,
    variation: Variation[] = null,
  ) {
    const { sku, translations, prices, quantity, product } = stockDto;
    const stock = new Stock();
    stock.sku = sku;
    stock.quantity = quantity;
    stock.created_by = await this.userRepo.findOne({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });
    stock.products = product;

    // console.log('stock sku ', sku);

    await this.stRepo.save(stock);

    // console.log('stock save 1 ');

    const translationsData = await Promise.all(
      translations.map(async (translationDto: any) => {
        const translation = await this.trRepo.createTranslation(
          translationDto,
          'stocks',
          stock.id,
          variation,
        );
        return translation;
      }),
    );
    stock.translations = translationsData;
    stock.variations = variation;
    // console.log('stock save 2 ');

    // Create and associate images
    /* const imagesData = await Promise.all(
      images.map(async (imageDto: any) => {
        const image = await this.imgRepo.createImage(
          imageDto,
          'stock',
          stock.id,
        );
        return image;
      }),
    );
    stock.images = imagesData; */

    // Create and associate images
    const pricesData = await Promise.all(
      prices.map(async (priceDto: PriceDto) => {
        const image = await this.prRepo.createPrice(priceDto, stock);
        return image;
      }),
    );
    stock.price = pricesData;
    // console.log('stock save 3 ');
    await this.stRepo.save(stock);

    return stock;
  }

  async updateStock(stockId: number, stockDto: UpdateStockDto, user) {
    try {
      const { sku, images, translations, prices, quantity } = stockDto;

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
      if (sku) {
        stock.sku = sku;
      }

      if (quantity) {
        stock.quantity = quantity;
      }
      stock.updated_by = await this.userRepo.findOne({
        where: { id: user.id },
        select: {
          id: true,
          username: true,
          name: true,
        },
      });

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

  async deletStock(id: number): Promise<any> {
    const product = await this.stRepo.findOne({
      where: { id },
      relations: ['translations', 'images', 'price'],
    });

    if (product.price && product.price.length > 0) {
      await Promise.all(
        product.price.map((stock) => this.prRepo.delete(stock.id)),
      );
    }

    // Delete associated translations
    if (product.translations && product.translations.length > 0) {
      await Promise.all(
        product.translations.map((translation) =>
          this.trRepo.delete(translation.id),
        ),
      );
    }

    // Delete associated images
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map((image) => this.imgRepo.delete(image.id)),
      );
    }

    // Delete the product itself
    await this.stRepo.delete(id);
  }
}
