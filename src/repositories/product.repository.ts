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
import {
  Inject,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { BulkProductUploadDto } from 'src/dto/product/bulk-product-upload.dto';
import { ElasticService } from 'src/services/elastic.service';
import { ProductInterationRepository } from './product-interaction.repository';
import { ProductInteractionTypeEnum } from 'src/enum/product-interation-type.enum';
import { UserRepository } from './user.repository';
import { getRandomProductInteractionType } from 'src/utils/brain.utils';
import { VariationRepository } from './varaition.repository';
import { CreateStockDto } from 'src/dto/stock/create-stock.dto';
import { PriceRepository } from './price.repository';
import { PriceDto } from 'src/dto/stock/price.dto';
import { ProductFeatureRepository } from './product-features.repository';
import { getEntityById } from 'src/utils/helper.utils';
import { UpdateFeaturesDto } from 'src/dto/product/update-features.dto';
import { CreateSeo } from 'src/dto/create-seo.dto';
import { LanguageRepository } from './language.repository';
import { Translations } from 'src/entities/translation.entity';
import * as CircularJSON from 'circular-json';
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

    @Inject(forwardRef(() => VariationRepository))
    private varRepo: VariationRepository,

    @Inject(forwardRef(() => PriceRepository))
    private prRepo: PriceRepository,

    @Inject(forwardRef(() => ProductFeatureRepository))
    private pfRepo: ProductFeatureRepository,

    @Inject(forwardRef(() => LanguageRepository))
    private langRepo: LanguageRepository,

    private langService: LangService,
    private elService: ElasticService,
  ) {
    super(prodRepo.target, prodRepo.manager, prodRepo.queryRunner);
  }
  private readonly indexName = process.env.PRODUCT_INDEX_ELK;

  async createProduct(createProductDto: CreateProductDto, user: any) {
    const {
      sku,
      slug,
      categoryIds,
      translations,
      variations,
      prices,
      quantity,
      features,
      combinations,
      images,
    } = createProductDto;

    user = await this.userRepo.findOne({ where: { id: user.id } });

    const product = new Product();
    product.sku = sku;
    product.slug = slug;
    product.quantity = quantity;
    product.created_by = await this.userRepo.findOne({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    if (categoryIds.length > 0) {
      const categories = await this.catRepo.find({
        where: { id: In(categoryIds) },
      });
      if (categories) {
        product.categories = categories;
      }
    }

    await this.prodRepo.save(product);

    const pricesData = await Promise.all(
      prices?.map(async (priceDto: PriceDto) => {
        const data = await this.prRepo.createProductPrice(priceDto, product);
        return data;
      }),
    );
    product.price = pricesData;

    let variationData = [];
    // Create and associate variations
    if (variations) {
      const varData = await Promise.all(
        variations.map(async (varDto) => {
          const variation = await this.varRepo.createVar(varDto);
          return variation;
        }),
      );
      variationData = varData.flat();
      product.variations = variationData;
    }

    // Create and associate stocks
    if (combinations && combinations?.length > 0) {
      let qty = 0;
      const pd = await this.findOne({ where: { id: product.id } });
      const stocksData = await Promise.all(
        combinations?.map(async (vd) => {
          const stQty = vd.quantity;
          const stockDto = new CreateStockDto();
          const skuCombi = vd.name;
          stockDto.sku = `${sku}~${skuCombi}`;
          stockDto.prices = vd.prices || prices;
          stockDto.translations = translations;
          stockDto.quantity = stQty;
          stockDto.product = pd;
          qty = qty + stQty;
          const stock = await this.stRepo.createStock(stockDto, user);
          return stock;
        }),
      );
      product.quantity = qty;
      product.stocks = stocksData;
    }

    // Create and associate translations
    const translationsData = await Promise.all(
      translations?.map(async (translationDto) => {
        const translation = await this.trRepo.createTranslation(
          translationDto,
          'product',
          product.id,
        );
        return translation;
      }),
    );
    product.translations = translationsData;

    if (images && images?.length > 0) {
      const imagesData = await Promise.all(
        images?.map(async (imageDto) => {
          const image = await this.imgRepo.createImage(
            imageDto,
            'product',
            product.id,
          );
          return image;
        }),
      );
      product.images = imagesData;
    }

    if (features && features?.length > 0) {
      const featuresData = await Promise.all(
        features?.map(async (createPFDto) => {
          const fData = await this.pfRepo.createFeatures(createPFDto, product);
          return fData;
        }),
      );
      product.features = featuresData;
    }

    this.prodRepo.save(product);

    const jsonResponse = CircularJSON.stringify({
      product,
    });

    return ApiResponse.success(
      JSON.parse(jsonResponse),
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

  async findDetails(slug: string, user: any): Promise<ApiResponse<Product>> {
    const lang = user?.lang || 'en';
    const currency = user?.currency || 'USD';
    const query = this.createQueryBuilder('product');

    const select = [
      'product',
      'stock',
      'created_by.username',
      'shop',
      'updated_by.username',
      'stockVariation',
      'stockTranslations',
      'stockLanguage',
      'currency',
      'price',
      'variations',
      'translations',
      'language',
      'images',
      'features',
      'featuresTranslations',
      'featuresLanguage',
      'category',
    ];
    query.leftJoinAndSelect('product.stocks', 'stock');
    query.leftJoinAndSelect('stock.price', 'price');
    query.leftJoinAndSelect('stock.translations', 'stockTranslations');
    query.leftJoinAndSelect('stockTranslations.language', 'stockLanguage');
    query.leftJoinAndSelect('product.created_by', 'created_by');
    query.leftJoinAndSelect('created_by.shop', 'shop');
    query.leftJoinAndSelect('product.updated_by', 'updated_by');
    query.leftJoinAndSelect('stock.variations', 'stockVariation');
    query.leftJoinAndSelect('price.currency', 'currency');
    query.leftJoinAndSelect('product.variations', 'variations');

    query.leftJoinAndSelect('product.translations', 'translations');
    query.leftJoinAndSelect('translations.language', 'language');
    query.leftJoinAndSelect('product.images', 'images');

    query.leftJoinAndSelect('product.categories', 'category');
    query.leftJoin('product.features', 'features');
    query.leftJoin('features.translations', 'featuresTranslations');
    query.leftJoin('featuresTranslations.language', 'featuresLanguage');
    query.andWhere(' product.slug = "' + slug + '" ');
    if (user && user?.roles?.name == process.env.MEMBER_ROLE_NAME) {
      query.andWhere(" currency.code = '" + currency + "'");
      query.andWhere(" language.code = '" + lang + "'");
      query.andWhere(" stockLanguage.code = '" + lang + "'");
      query.andWhere(" featuresLanguage.code = '" + lang + "'");
    }

    if (!user) {
      query.andWhere(" currency.code = '" + currency + "'");
      query.andWhere(" language.code = '" + lang + "'");
      query.andWhere(" stockLanguage.code = '" + lang + "'");
      query.andWhere(" featuresLanguage.code = '" + lang + "'");
    }

    if (user?.roles?.name == process.env.VENDOR_ROLE_NAME) {
      query.andWhere(' created_by.id = ' + user?.id + ' ');
    }

    const product = await query.select(select).getOne();

    if (!product && user?.roles?.name == process.env.VENDOR_ROLE_NAME) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: `UNAUTHORIZED`,
        param: `Product`,
      });
    }

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

    await this.elService.createIndex(this.indexName, product);

    return ApiResponse.success(product, 200);
  }

  async getProductId(id: number, user: any): Promise<ApiResponse<Product>> {
    const lang = user?.lang || 'en';
    const currency = user?.currency || 'USD';
    const query = this.createQueryBuilder('product');

    const select = [
      'product',
      'stock',
      'created_by.username',
      'updated_by.username',
      'stockVariation',
      'currency',
      'price',
      'variations',
      'translations',
      'language',
      'images',
      'features',
      'featuresTranslations',
      'featuresLanguage',
      'category',
    ];
    query.leftJoinAndSelect('product.stocks', 'stock');
    query.leftJoinAndSelect('stock.price', 'price');
    query.leftJoinAndSelect('product.created_by', 'created_by');
    query.leftJoinAndSelect('product.updated_by', 'updated_by');
    query.leftJoinAndSelect('stock.variations', 'stockVariation');
    query.leftJoinAndSelect('price.currency', 'currency');
    query.leftJoinAndSelect('product.variations', 'variations');

    query.leftJoinAndSelect('product.translations', 'translations');
    query.leftJoinAndSelect('translations.language', 'language');
    query.leftJoinAndSelect('product.images', 'images');

    query.leftJoinAndSelect('product.categories', 'category');
    query.leftJoin('product.features', 'features');
    query.leftJoin('features.translations', 'featuresTranslations');
    query.leftJoin('featuresTranslations.language', 'featuresLanguage');
    query.andWhere(' product.id = ' + id + ' ');
    if (!user || user?.roles?.name == process.env.MEMBER_ROLE_NAME) {
      query.andWhere(" currency.code = '" + currency + "'");
      query.andWhere(" language.code = '" + lang + "'");
    }

    if (user?.roles?.name == process.env.VENDOR_ROLE_NAME) {
      query.andWhere(' created_by.id = ' + user?.id + ' ');
    }

    const product = await query.select(select).getOne();

    if (!product && user?.roles?.name == process.env.VENDOR_ROLE_NAME) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: `UNAUTHORIZED`,
        param: `Product`,
      });
    }

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

    await this.elService.createIndex(this.indexName, product);

    return ApiResponse.success(product, 200);
  }

  async updateProduct(id: any, updateProductDto: UpdateProductDto, user: any) {
    const { sku, categoryIds, status, stocks, translations, images } =
      updateProductDto;
    // Retrieve the existing product from the database
    const product = await this.prodRepo.findOne({
      where: {
        id,
      },
      relations: ['created_by'],
    });

    if (!product) {
      // Handle the case where the product with the given ID is not found
      throw new NotFoundException({
        statusCode: 404,
        message: `NOT_FOUND`,
        param: 'Product',
      });
    }

    if (
      user?.roles?.name == process.env.VENDOR_ROLE_NAME &&
      product.created_by.id !== user?.id
    ) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: `UNAUTHORIZED`,
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
          return this.imgRepo.createImage(imageDto.url, 'product', product.id);
        }),
      );
      product.images = updatedImages;
    }

    await product.save();

    return ApiResponse.success(
      null,
      200,
      this.langService.getTranslation('UPDATED_SUCCESSFULLY', 'Product'),
    );
  }

  async findProducts(req: SearchProductDto, user: any) {
    const lang = user?.lang || 'en';
    const currency = user?.currency || 'USD';
    const query = this.createQueryBuilder('product');

    const select = [
      'product',
      'created_by.username',
      'updated_by.username',
      'variations',
      'translations',
      'language',
      'images',
    ];

    query.leftJoinAndSelect('product.created_by', 'created_by');
    query.leftJoinAndSelect('product.updated_by', 'updated_by');
    query.leftJoinAndSelect('product.variations', 'variations');

    query.leftJoinAndSelect('product.translations', 'translations');
    query.leftJoinAndSelect('translations.language', 'language');
    query.leftJoinAndSelect('product.images', 'images');

    query.leftJoinAndSelect('product.categories', 'category');

    if (user?.roles?.name == process.env.VENDOR_ROLE_NAME) {
      query.andWhere(' created_by.id = ' + user?.id + ' ');
    }

    if (req.createdDate) {
      const [startDate, endDate] = req.createdDate.split(',');
      query.andWhere('product.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (
      req.user === null ||
      req?.user?.roles?.name == process.env.MEMBER_ROLE_NAME
    ) {
      query.andWhere(" currency.code = '" + currency + "'");
      query.andWhere(" language.code = '" + lang + "'");
    }

    if (req.search) {
      query.andWhere(
        '(product.sku LIKE :title OR translations.name LIKE :title OR stock.sku = :title OR featuresTranslations.name = :title )',
        { title: `%${req.search}%` },
      );
    }

    if (req.title) {
      query.andWhere(
        '(product.title LIKE :title OR translations.name LIKE :title)',
        { title: `%${req.title}%` },
      );
    }

    if (req.created_by) {
      query.andWhere('created_by.username LIKE :createdBy', {
        createdBy: `%${req.created_by}%`,
      });
    }

    if (req.updated_by) {
      query.andWhere('updated_by.username LIKE :updatedBy', {
        updatedBy: `%${req.updated_by}%`,
      });
    }

    if (req.sku) {
      query.andWhere('(product.sku LIKE :sku OR stock.sku LIKE :sku)', {
        sku: `%${req.sku}%`,
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
        categoryIds: req.category_ids.split(','),
      });
    }
    const [list, count] = await query
      .select(select)
      .skip(req.offset)
      .take(req.limit)
      .getManyAndCount();

    return ApiResponse.paginate({ list, count }, 200);
  }

  async deleteProduct(id: number) {
    const product = await this.prodRepo.findOne({
      where: { id },
      relations: ['stocks', 'translations', 'images', 'features', 'price'],
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
        product.stocks.map((stock) => this.stRepo.deletStock(stock.id)),
      );
    }

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

    if (product.features && product.features.length > 0) {
      await Promise.all(
        product.features.map((pf) => this.pfRepo.delete(pf.id)),
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

  async createSeo(id: number, req: CreateSeo, user: any) {
    const product = await getEntityById(this.prRepo, id);
    const { translations } = req;
    if (product) {
      const updatedTrans = [];
      for (const tr of translations) {
        const eTrans = await this.trRepo.findOne({
          where: {
            products: {
              id: product.id,
            },
            language: {
              code: tr.language_code,
            },
          },
        });

        if (eTrans) {
          eTrans.meta_keywords = tr.meta_keywords || eTrans.meta_keywords;
          eTrans.meta_title = tr.meta_title || eTrans.meta_title;
          eTrans.meta_descriptions =
            tr.meta_descriptions || eTrans.meta_descriptions;
          await eTrans.save();
          updatedTrans.push(eTrans);
        } else {
          const tra = new Translations();
          tra.meta_keywords = tr.meta_keywords;
          tra.meta_title = tr.meta_title;
          tra.meta_descriptions = tr.meta_descriptions;
          tra.language = await this.langRepo.findOne({
            where: { code: tr.language_code },
          });
          tra.products = product;
          await tra.save();
          updatedTrans.push(tra);
        }
      }

      product.translations = updatedTrans;
      await product.save();
    }

    product.updated_by = await this.userRepo.findOne({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    await product.save();

    const jsonResponse = CircularJSON.stringify({
      product,
    });

    return ApiResponse.success(
      JSON.parse(jsonResponse),
      200,
      this.langService.getTranslation('UPDATED_SUCCESSFULLY', 'Product SEO'),
    );
  }

  async updateSeo(id: number, req: UpdateFeaturesDto[], user: any) {
    const product = await getEntityById(this.prRepo, id);
    if (req && req?.length > 0) {
      const featuresData = await Promise.all(
        req?.map(async (imageDto) => {
          const image = await this.pfRepo.updateFeatures(imageDto);
          return image;
        }),
      );
      product.features = featuresData;
    }
    product.updated_by = await this.userRepo.findOne({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    await product.save();

    return ApiResponse.success(
      product,
      200,
      this.langService.getTranslation('UPDATED_SUCCESSFULLY', 'Product'),
    );
  }
}
