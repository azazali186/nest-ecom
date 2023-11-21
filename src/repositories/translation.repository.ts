import { InjectRepository } from '@nestjs/typeorm';
import { CreateTranslationDto } from 'src/dto/translation/create-translation.dto';
import { Translations } from 'src/entities/translation.entity';
import { Repository } from 'typeorm';
import { LanguageRepository } from './language.repository';
import { CategoryRepository } from './category.repository';
import { ProductRepository } from './product.repository';
import { StockRepository } from './stock.repository';
import { UpdateTranslationDto } from 'src/dto/translation/update-translation.dto';

export class TranslationsRepository extends Repository<Translations> {
  constructor(
    @InjectRepository(Translations)
    private transRepo: Repository<Translations>,

    @InjectRepository(CategoryRepository)
    private catRepo: CategoryRepository,

    @InjectRepository(StockRepository)
    private stRepo: StockRepository,

    @InjectRepository(ProductRepository)
    private prodRepo: ProductRepository,

    @InjectRepository(LanguageRepository)
    private langRepo: LanguageRepository,
  ) {
    super(transRepo.target, transRepo.manager, transRepo.queryRunner);
  }

  async createTranslation(translationDto: CreateTranslationDto, type, id) {
    const {
      name,
      language_id,
      description,
      meta_title,
      meta_keywords,
      meta_description,
    } = translationDto;

    const translation = new Translations();

    if (name) {
      translation.name = name;
    }

    if (description) {
      translation.description = description;
    }

    if (meta_title) {
      translation.meta_title = meta_title;
    }

    if (meta_keywords) {
      translation.meta_keywords = meta_keywords;
    }

    if (meta_description) {
      translation.meta_descriptions = meta_description;
    }

    if (language_id) {
      const lang = await this.langRepo.findOne({ where: { id: language_id } });
      translation.language = lang;
    }

    if (name) {
      translation.name = name;
    }

    switch (type) {
      case 'product':
        const product = await this.prodRepo.findOne({
          where: { id: id },
        });
        translation.products = product;
        break;

      case 'category':
        const category = await this.catRepo.findOne({
          where: { id: id },
        });
        translation.categories = category;
        break;

      case 'stocks':
        const stock = await this.stRepo.findOne({
          where: { id: id },
        });
        translation.stock = stock;
        break;
    }

    await this.transRepo.save(translation);

    return translation;
  }

  async updateTranslation(translationDto: UpdateTranslationDto) {
    const {
      id,
      name,
      language_id,
      description,
      meta_title,
      meta_keywords,
      meta_descriptions,
    } = translationDto;

    const translation = await this.transRepo.findOne({ where: { id: id } });

    if (language_id) {
      const lang = await this.langRepo.findOne({ where: { id: language_id } });
      translation.language = lang;
    }

    if (name) {
      translation.name = name;
    }

    if (description) {
      translation.description = description;
    }

    if (meta_title) {
      translation.meta_title = meta_title;
    }

    if (meta_keywords) {
      translation.meta_keywords = meta_keywords;
    }

    if (meta_descriptions) {
      translation.meta_descriptions = meta_descriptions;
    }

    if (name) {
      translation.name = name;
    }

    await this.transRepo.save(translation);

    return translation;
  }
}
