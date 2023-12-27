/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTranslationDto } from 'src/dto/translation/create-translation.dto';
import { Seo } from 'src/entities/seo.entity';
import { Repository } from 'typeorm';
import { TranslationsRepository } from './translation.repository';

export class SeoRepository extends Repository<Seo> {
  constructor(
    @InjectRepository(Seo)
    private seoRepo: Repository<Seo>,

    @Inject(forwardRef(() => TranslationsRepository))
    private trRepo: TranslationsRepository,
  ) {
    super(seoRepo.target, seoRepo.manager, seoRepo.queryRunner);
  }

  async createUpdateSeo(
    createDto: CreateTranslationDto[],
    data: any,
    type: string,
  ) {
    try {
      const seo = new Seo();
      switch (type) {
        case 'product':
          seo.products = data;
          break;
        case 'category':
          seo.category = data;
          break;

        default:
          break;
      }
      await this.seoRepo.save(seo);
      const translationsData = await Promise.all(
        createDto?.map(async (translationDto) => {
          const translation = await this.trRepo.createTranslation(
            translationDto,
            'seo',
            seo.id,
          );
          return translation;
        }),
      );

      seo.translations = translationsData;

      await this.seoRepo.save(seo);

      return seo;
    } catch (error) {
      console.log('Error while creation features');
    }
  }
}
