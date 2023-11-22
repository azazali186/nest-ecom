import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/dto/product/create-product.dto';
import { SearchProductDto } from 'src/dto/product/search-product.dto';
import { UpdateProductDto } from 'src/dto/product/update-product.dto';
import { Product } from 'src/entities/product.entity';
import { In, Repository } from 'typeorm';
import { StockRepository } from './stock.repository';
import { ImagesRepository } from './image.repository';
import { TranslationsRepository } from './translation.repository';
import { CategoryRepository } from './category.repository';
import { ApiResponse } from 'src/utils/response.util';
import { LangService } from 'src/services/lang.service';
import { Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { BulkProductUploadDto } from 'src/dto/product/bulk-product-upload.dto';
import { ElasticService } from 'src/services/elastic.service';
import { ProductInterationRepository } from './product-interaction.repository';
import { ProductInteractionTypeEnum } from 'src/enum/product-interation-type.enum';
import { UserRepository } from './user.repository';
import { getRandomProductInteractionType } from 'src/utils/brain.utils';
export class ProductRepository extends Repository<Product> {
  constructor(
    @InjectRepository(Product)
    private prodRepo: Repository<Product>,

    @Inject(forwardRef(() => StockRepository))
    private stRepo: StockRepository,

    @Inject(forwardRef(() => CategoryRepository))
    private catRepo: CategoryRepository,

    @Inject(forwardRef(() => ImagesRepository))
    private imgRepo: ImagesRepository,

    @Inject(forwardRef(() => TranslationsRepository))
    private trRepo: TranslationsRepository,

    @Inject(forwardRef(() => ProductInterationRepository))
    private intRepo: ProductInterationRepository,

    @Inject(forwardRef(() => UserRepository))
    private userRepo: UserRepository,

    private langService: LangService,
    private elService: ElasticService,
  ) {
    super(prodRepo.target, prodRepo.manager, prodRepo.queryRunner);
  }
  private readonly indexName = process.env.PRODUCT_INDEX_ELK;
  async createProduct(
    createProductDto: CreateProductDto,
    user: any,
  ): Promise<ApiResponse<Product>> {
    const { sku, categoryIds, stocks, translations, images } = createProductDto;

    const product = new Product();
    product.sku = sku;
    product.created_by = user;

    if (categoryIds.length > 0) {
      const categories = await this.catRepo.find({
        where: { id: In(categoryIds) },
      });

      product.categories = categories;
    }

    await this.prodRepo.save(product);

    // Create and associate stocks
    const stocksData = await Promise.all(
      stocks.map(async (stockDto) => {
        const stock = await this.stRepo.createStock(stockDto, user);
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
        const image = await this.imgRepo.createImage(
          imageDto,
          'product',
          product.id,
        );
        return image;
      }),
    );
    product.images = imagesData;

    // Save the product with all associations
    await this.prodRepo.save(product);
    return ApiResponse.create(
      this.prodRepo.save(product),
      201,
      this.langService.getTranslation('CREATED_SUCCESSFULLY', 'Product'),
    );
  }

  bulkCreate(req: BulkProductUploadDto, user: any) {
    const data = [];
    const error = [];
    req.data.map(async (createProductDto) => {
      try {
        const prod = await this.createProduct(createProductDto, user);
        data.push(prod.data);
      } catch (e) {
        error.push({ sku: createProductDto.sku, error: e });
      }
    });
    return ApiResponse.success(data, 200, 'Success', error);
  }

  async getProductId(id: number, user: any): Promise<ApiResponse<Product>> {
    const product = await this.prodRepo.findOne({
      where: { id },
      relations: [
        'categories',
        'stocks',
        'stocks.translations',
        'stocks.translations.language',
        'stocks.images',
        'stocks.price',
        'stocks.price.currency',
        'translations',
        'translations.language',
        'images',
      ],
    });

    if (!product) {
      throw new NotFoundException({
        statusCode: 404,
        message: `NOT_FOUND`,
        param: `Product`,
      });
    }

    if (!user) {
      user = await this.userRepo.findOne({
        where: { username: process.env.GUEST_USERNAME || 'guest' },
      });
    }

    const type =
      process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'dev'
        ? getRandomProductInteractionType()
        : ProductInteractionTypeEnum.views;

    await this.intRepo.createInteraction({
      product,
      user,
      type: type,
    });

    const elk = await this.elService.createIndex(this.indexName, product);

    return ApiResponse.success(product, 200);
  }

  

  async updateProduct(id: any, updateProductDto: UpdateProductDto, user: any) {
    const { sku, categoryIds, status, stocks, translations, images } =
      updateProductDto;
    // Retrieve the existing product from the database
    const product = await this.prodRepo.findOne(id);

    if (!product) {
      // Handle the case where the product with the given ID is not found
      throw new NotFoundException({
        statusCode: 404,
        message: `NOT_FOUND`,
        param: `Product`,
      });
    }

    if (sku) {
      product.sku = sku;
    }

    if (status) {
      product.status = status;
    }

    if (categoryIds?.length > 0) {
      const categories = await this.catRepo.find({
        where: { id: In(categoryIds) },
      });
      product.categories = categories;
    }

    if (stocks?.length > 0) {
      const updatedStocks = await Promise.all(
        stocks.map(async (stockDto) => {
          if (stockDto.id) {
            // If stock has an ID, update the existing stock
            const existingStock = await this.stRepo.updateStock(
              stockDto.id,
              stockDto,
              user,
            );
            if (existingStock) {
              // ...
              return existingStock;
            }
          }

          // If stock doesn't have an ID, create a new stock
          return this.stRepo.createStock(stockDto, user);
        }),
      );
      product.stocks = updatedStocks;
    }

    if (translations?.length > 0) {
      const updatedTranslations = await Promise.all(
        translations.map(async (translationDto) => {
          if (translationDto.id) {
            // If translation has an ID, update the existing translation
            const existingTranslation =
              await this.trRepo.updateTranslation(translationDto);
            if (existingTranslation) {
              return existingTranslation;
            }
          }
          return this.trRepo.createTranslation(
            translationDto,
            'product',
            product.id,
          );
        }),
      );
      product.translations = updatedTranslations;
    }

    if (images?.length > 0) {
      const updatedImages = await Promise.all(
        images.map(async (imageDto) => {
          if (imageDto.id) {
            // If image has an ID, update the existing image
            const existingImage = await this.imgRepo.updateImage(imageDto);
            if (existingImage) {
              return existingImage;
            }
          }

          // If image doesn't have an ID, create a new image
          return this.imgRepo.createImage(imageDto.url, 'product', product.id);
        }),
      );
      product.images = updatedImages;
    }
  }

  async findProducts(req: SearchProductDto) {
    const query = this.createQueryBuilder('product');

    // Join with Stock entity to include price in the search
    query.leftJoinAndSelect('product.stocks', 'stock');

    // Join with Translations entity to include title in the search
    query.leftJoinAndSelect('product.translations', 'translations');

    // Join with Categories entity to filter by category_ids
    query.leftJoin('product.categories', 'category');

    // Add filters based on the provided search criteria
    if (req.createdDate) {
      const [startDate, endDate] = req.createdDate.split(',');
      query.andWhere('product.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (req.title) {
      // Check title in both Product and Translations entities
      query.andWhere(
        '(product.title LIKE :title OR translations.title LIKE :title)',
        { title: `%${req.title}%` },
      );
    }

    if (req.created_by) {
      query.andWhere('product.created_by_username = :createdBy', {
        createdBy: req.created_by,
      });
    }

    if (req.updated_by) {
      query.andWhere('product.updated_by_username = :updatedBy', {
        updatedBy: req.updated_by,
      });
    }

    if (req.sku) {
      // Check sku in both Product and Stock entities
      query.andWhere('(product.sku = :sku OR stock.sku = :sku)', {
        sku: req.sku,
      });
    }

    if (req.price_range) {
      const [minPrice, maxPrice] = req.price_range.split(',');
      query.andWhere('stock.price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      });
    }

    if (req.status) {
      query.andWhere('product.status = :status', { status: req.status });
    }

    if (req.category_ids && req.category_ids.length > 0) {
      query.andWhere('category.id IN (:...categoryIds)', {
        categoryIds: req.category_ids,
      });
    }

    console.log('products Start');

    const [products, count] = await query.getManyAndCount();

    console.log('products End', products);

    // Execute the query and return the results
    return ApiResponse.paginate({ list: products, count: count }, 200);
  }

  async deleteProduct(id: number) {
    // Retrieve the product from the database
    const product = await this.prodRepo.findOne({
      where: { id },
      relations: ['stocks', 'translations', 'images'],
    });

    if (!product) {
      // Handle the case where the product with the given ID is not found
      throw new NotFoundException({
        statusCode: 404,
        message: `NOT_FOUND`,
        param: `Product`,
      });
    }

    // Delete associated stocks
    if (product.stocks && product.stocks.length > 0) {
      await Promise.all(
        product.stocks.map((stock) => this.stRepo.delete(stock.id)),
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
    await this.prodRepo.delete(id);

    return ApiResponse.success(
      null,
      200,
      this.langService.getTranslation('DELETED_SUCCESSFULLY', 'Product'),
    );
  }
}
