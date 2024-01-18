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

    let relations = ['translations'];
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
    if (search) {
      where = (qb: any) => {
        qb.where({
          $or: [
            { 'translations.name': Like('%' + search + '%') },
            { sku: Like('%' + search + '%') },
            { slug: Like('%' + search + '%') },
            {
              $or: [
                { 'stocks.translations.name': Like('%' + search + '%') },
                { 'stocks.sku': Like('%' + search + '%') },
              ],
            },
          ],
        });
      };
      relations = ['translations', 'stocks', 'stocks.translations'];
      select = {
        id: true,
        translations: {
          id: true,
          name: true,
        },
        stocks: {
          id: true,
          translations: {
            id: true,
            name: true,
          },
        },
      };
    }
    const products = await this.prodRepo.find({
      where: where,
      relations: relations,
      select: select,
      take: 10,
    });

    if (search) {
      where = (qb: any) => {
        qb.where({
          $or: [
            { name: Like('%' + search + '%') },
            { slug: Like('%' + search + '%') },
          ],
        });
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
}
