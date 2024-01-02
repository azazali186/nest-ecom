import { Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCatalogDto } from 'src/dto/catalog/create-catalog.dto';
import { SearchCatalogDto } from 'src/dto/catalog/search-catalog.dto';
import { UpdateCatalogDto } from 'src/dto/catalog/update-catalog.dto';
import { Catalog } from 'src/entities/catalog.entity';
import { Between, In, Like, Repository } from 'typeorm';
import { ProductRepository } from './product.repository';
import { TranslationsRepository } from './translation.repository';
import { ImagesRepository } from './image.repository';
import { ApiResponse } from 'src/utils/response.util';
import { UserRepository } from './user.repository';

export class CatalogRepository extends Repository<Catalog> {
  constructor(
    @InjectRepository(Catalog)
    private cpRepo: Repository<Catalog>,

    @Inject(forwardRef(() => ProductRepository))
    private prodRepo: ProductRepository,

    @Inject(forwardRef(() => TranslationsRepository))
    private trRepo: TranslationsRepository,

    @Inject(forwardRef(() => ImagesRepository))
    private imgRepo: ImagesRepository,

    @Inject(forwardRef(() => UserRepository))
    private userRepo: UserRepository,
  ) {
    super(cpRepo.target, cpRepo.manager, cpRepo.queryRunner);
  }

  async createCatalog(req: CreateCatalogDto, user: any) {
    const { productIds, translations, images, code } = req;

    const cat = new Catalog();

    cat.created_by = await this.userRepo.findOne({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });
    cat.code = code;

    cat.products = await this.prodRepo.find({
      where: { id: In(productIds) },
    });

    await this.cpRepo.save(cat);

    cat.translations = await Promise.all(
      translations.map(async (translationDto: any) => {
        const translation = await this.trRepo.createTranslation(
          translationDto,
          'catalog',
          cat.id,
        );
        return translation;
      }),
    );

    if (images && images.length > 0) {
      cat.images = await Promise.all(
        images.map(async (imageDto: any) => {
          const image = await this.imgRepo.createImage(
            imageDto,
            'catalog',
            cat.id,
          );
          return image;
        }),
      );
    }
    return ApiResponse.success(null, 201, 'Created Successfully');
  }

  async findCatalogs(req: SearchCatalogDto) {
    const { name, code, createdDate, limit, offset } = req;

    const where: any = {};

    if (name) {
      where.name = Like('%' + name + '%');
    }
    if (code) {
      where.translations.code = Like('%' + code + '%');
    }
    if (createdDate) {
      const dates = createdDate.split('-');
      if (dates.length === 1) {
        where.created_at = Between(
          dates[0] + ' 00:00:00',
          dates[0] + ' 23:59:59',
        );
      }
      if (dates.length === 2) {
        where.created_at = Between(
          dates[0] + ' 00:00:00',
          dates[1] + ' 23:59:59',
        );
      }
    }
    const cat = await this.find({
      where: where,
      relations: {
        products: {
          translations: true,
        },
        translations: true,
        images: true,
      },
      skip: offset,
      take: limit,
    });
    return ApiResponse.success(cat, 200, 'fetched Successfully');
  }
  async getCatalogId(id: number) {
    const cat = await this.findOneOrFail({
      where: { id },
      relations: {
        products: {
          translations: true,
          price: true,
          // stocks: { translations: true, price: true },
          images: true,
        },
        translations: true,
        images: true,
      },
    });
    return ApiResponse.success(cat, 200, 'fetched Successfully');
  }
  async updateCatalog(id: any, req: UpdateCatalogDto, user: any) {
    const { productIds, translations, images, code } = req;

    const cat = await Catalog.findOne({ where: { id: id } });

    cat.created_by = await this.userRepo.findOne({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    if (code) {
      cat.code = code;
    }

    if (productIds) {
      cat.products = await this.prodRepo.find({
        where: { id: In(productIds) },
      });
    }

    await this.cpRepo.save(cat);

    if (translations) {
      cat.translations = await Promise.all(
        translations.map(async (translationDto: any) => {
          const translation = await this.trRepo.createTranslation(
            translationDto,
            'catalog',
            cat.id,
          );
          return translation;
        }),
      );
    }

    if (images) {
      if (images && images.length > 0) {
        cat.images = await Promise.all(
          images.map(async (imageDto: any) => {
            const image = await this.imgRepo.createImage(
              imageDto,
              'catalog',
              cat.id,
            );
            return image;
          }),
        );
      }
    }

    return ApiResponse.success(null, 201, 'Created Successfully');
  }
}
