import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { SearchDto } from 'src/dto/search/search.dto';
import { CategoryRepository } from 'src/repositories/category.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ShopRepository } from 'src/repositories/shop.repository';
import { ApiResponse } from 'src/utils/response.util';
import { Like } from 'typeorm';
import { ElasticService } from './elastic.service';
import { Search } from 'src/entities/search.entity';

@Injectable()
export class SearchService {
  constructor(
    @Inject(forwardRef(() => CategoryRepository))
    private catRepo: CategoryRepository,

    @Inject(forwardRef(() => ProductRepository))
    private prodRepo: ProductRepository,

    @Inject(forwardRef(() => ShopRepository))
    private shopRepo: ShopRepository,

    private elService: ElasticService,
  ) {}

  private readonly indexName = process.env.SEARCH_INDEX_ELK;

  async search(req: SearchDto) {
    const { search } = req;

    let where: any = {};

    if (search) {
      where.translations = {
        name: Like('%' + search + '%'),
      };
    }

    const relations = ['translations'];
    let select: any = {
      id: true,
      name: true,
      translations: {
        id: true,
        name: true,
      },
    };

    const cats = await this.catRepo.find({
      where: where,
      relations: relations,
      select: select,
      take: 10,
    });
    where = {};
    const query = this.prodRepo.createQueryBuilder('product');
    query.leftJoinAndSelect('product.translations', 'translations');
    query.leftJoinAndSelect('translations.language', 'language');
    if (search) {
      query.andWhere(
        '(product.sku LIKE :title OR translations.name LIKE :title )',
        { title: `%${search}%` },
      );
    }

    const products = await query
      .select(['product.id', 'translations.id', 'translations.name'])
      .take(10)
      .getMany();

    if (search) {
      where = {
        name: Like('%' + search + '%'),
      };
      select = {
        id: true,
        name: true,
        slug: true,
      };
    }

    const shops = await this.shopRepo.find({
      where: where,
      select: select,
      take: 10,
    });

    const data = {
      products: {
        list: products,
        count: products.length,
      },
      cats: {
        list: cats,
        count: cats.length,
      },
      shops: {
        list: shops,
        count: shops.length,
      },
    };

    const searchData = {
      search: search,
    };

    let sd = await Search.findOne({ where: { search: search } });
    if (!sd) {
      sd = new Search();
      sd.search = search;
      await sd.save();
    } else {
      sd.times = sd.times + 1;
      await sd.save();
    }

    await this.elService.createIndex(this.indexName, searchData);

    return ApiResponse.success(data, 200);
  }

  async searchShop(shop: string) {
    console.log('Search data is ', shop);
    const shops = await this.shopRepo.find({
      where: {
        name: Like('%' + shop + '%'),
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return ApiResponse.success(shops, 200);
  }

  async searchCategory(search: string) {
    const where: any = {};

    if (search) {
      where.translations = {
        name: Like('%' + search + '%'),
      };
    }

    const relations = ['translations', 'translations.language'];

    const cats = await this.catRepo.find({
      where: where,
      relations: relations,
    });
    return ApiResponse.success(cats, 200);
  }
  async searchProducts(search: string) {
    const query = this.prodRepo.createQueryBuilder('product');
    query.leftJoinAndSelect('product.translations', 'translations');
    query.leftJoinAndSelect('translations.language', 'language');
    if (search) {
      query.andWhere(
        '(product.sku LIKE :title OR translations.name LIKE :title )',
        { title: `%${search}%` },
      );
    }

    const products = await query
      .select(['product.id', 'translations.id', 'translations.name'])
      .getMany();

    return ApiResponse.success(products, 200);
  }
}
