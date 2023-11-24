import { Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCatalogDto } from 'src/dto/catalog/create-catalog.dto';
import { SearchCatalogDto } from 'src/dto/catalog/search-catalog.dto';
import { UpdateCatalogDto } from 'src/dto/catalog/update-catalog.dto';
import { Catalog } from 'src/entities/catalog.entity';
import { In, Repository } from 'typeorm';
import { ProductRepository } from './product.repository';
import { TranslationsRepository } from './translation.repository';
import { ImagesRepository } from './image.repository';
import { ApiResponse } from 'src/utils/response.util';

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
  ) {
    super(cpRepo.target, cpRepo.manager, cpRepo.queryRunner);
  }

  async createCatalog(req: CreateCatalogDto, user: any) {
    const { productIds, translations, images } = req;

    const cat = new Catalog();

    cat.created_by = user;

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

  findCatalogs(name: SearchCatalogDto) {
    throw new Error('Method not implemented.');
  }
  async getCatalogId(id: number) {
    const cat = await this.findOneOrFail({
      where: { id },
      relations: {
        products: { translations: true },
        translations: true,
        images: true,
      },
    });
    return ApiResponse.success(cat, 200, 'fetched Successfully');
  }
  updateCatalog(id: any, req: UpdateCatalogDto) {
    throw new Error('Method not implemented.');
  }
}
