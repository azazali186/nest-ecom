import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/dto/product/create-product.dto';
import { SearchProductDto } from 'src/dto/product/search-product.dto';
import { UpdateProductDto } from 'src/dto/product/update-product.dto';
import { Product } from 'src/entities/product.entity';
import { In, Repository } from 'typeorm';
import { StockRepository } from './stock.repository';
import { ImagesRepository } from './image.repository';
import { TranslationsRepository } from './translation.repository';
import { PriceRepository } from './price.repository';
import { CategoryRepository } from './category.repository';

export class ProductRepository extends Repository<Product> {
  constructor(
    @InjectRepository(Product)
    private prodRepo: Repository<Product>,

    @InjectRepository(StockRepository)
    private stRepo: StockRepository,

    @InjectRepository(CategoryRepository)
    private catRepo: CategoryRepository,

    @InjectRepository(ImagesRepository)
    private imgRepo: ImagesRepository,

    @InjectRepository(TranslationsRepository)
    private trRepo: TranslationsRepository,

    @InjectRepository(PriceRepository)
    private prRepo: PriceRepository,
  ) {
    super(prodRepo.target, prodRepo.manager, prodRepo.queryRunner);
  }
  async createProduct(
    createProductDto: CreateProductDto,
    user: any,
  ): Promise<Product> {
    const { sku, categoryIds, stocks, translations, images } = createProductDto;

    let product = new Product();
    product.sku = sku;
    product.created_by = user;

    if (categoryIds.length > 0) {
      const categories = await this.catRepo.find({
        where: { id: In(categoryIds) },
      });

      product.categories = categories;
    }

    product = await this.prodRepo.save(product);

    // Create and associate stocks
    const stocksData = await Promise.all(
      stocks.map(async (stockDto) => {
        const stock = await this.stRepo.createStock(stockDto);
        return stock;
      }),
    );
    product.stocks = stocksData;

    // Create and associate translations
    const translationsData = await Promise.all(
      translations.map(async (translationDto) => {
        const translation = await this.trRepo.createTranslation(
          translationDto,
          'product',
          product.id,
        );
        return translation;
      }),
    );
    product.translations = translationsData;

    // Create and associate images
    const imagesData = await Promise.all(
      images.map(async (imageDto) => {
        const image = await this.imgRepo.createImage(imageDto);
        return image;
      }),
    );
    product.images = imagesData;

    // Save the product with all associations
    return await this.prodRepo.save(product);
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
}
