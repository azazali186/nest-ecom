import { Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFeaturesDto } from 'src/dto/product/create-features.dto';
import { ProductFeature } from 'src/entities/product-features.entity';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { TranslationsRepository } from './translation.repository';
import { UpdateFeaturesDto } from 'src/dto/product/update-features.dto';

export class ProductFeatureRepository extends Repository<ProductFeature> {
  constructor(
    @InjectRepository(ProductFeature)
    private pfRepo: Repository<ProductFeature>,

    @Inject(forwardRef(() => TranslationsRepository))
    private trRepo: TranslationsRepository,
  ) {
    super(pfRepo.target, pfRepo.manager, pfRepo.queryRunner);
  }

  async createFeatures(createDto: CreateFeaturesDto, product: Product) {
    try {
      const pf = new ProductFeature();
      pf.products = product;
      pf.type = createDto.name;
      await this.pfRepo.save(pf);
      // Create and associate translations
      const translationsData = await Promise.all(
        createDto.translations?.map(async (translationDto) => {
          const translation = await this.trRepo.createTranslation(
            translationDto,
            'feature',
            pf.id,
          );
          return translation;
        }),
      );

      pf.translations = translationsData;

      await this.pfRepo.save(pf);

      return pf;
    } catch (error) {
      console.log('Error while creation features');
    }
  }

  async updateFeatures(req: UpdateFeaturesDto) {
    try {
      const pf = await this.pfRepo.findOne({ where: { id: req.id } });
      if (!pf) {
        throw new NotFoundException({
          statusCode: 404,
          message: `NOT_FOUND`,
          param: `${req.name} ProductFeatures`,
        });
      }
      // Create and associate translations
      const translationsData = await Promise.all(
        req.translations?.map(async (translationDto) => {
          const translation =
            await this.trRepo.updateTranslation(translationDto);
          return translation;
        }),
      );

      pf.translations = translationsData;

      await this.pfRepo.save(pf);

      return pf;
    } catch (error) {
      console.log('Error while creation features');
    }
  }
}
