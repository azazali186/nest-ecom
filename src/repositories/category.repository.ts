import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/dto/category/create-category.dto';
import { SearchCategoryDto } from 'src/dto/category/search-category.dto';
import { UpdateCategoryDto } from 'src/dto/category/update-category.dto';
import { Category } from 'src/entities/category.entity';
import { Translations } from 'src/entities/translation.entity';
import { ApiResponse } from 'src/utils/response.util';
import { Like, Repository } from 'typeorm';
import { LanguageRepository } from './language.repository';
import { TranslationsRepository } from './translation.repository';
import { LangService } from 'src/services/lang.service';
import { Images } from 'src/entities/images.entity';
import { ImagesRepository } from './image.repository';
import { NotFoundException } from '@nestjs/common';

export class CategoryRepository extends Repository<Category> {
  constructor(
    @InjectRepository(Category)
    private catRepo: Repository<Category>,

    @InjectRepository(LanguageRepository)
    private langRepo: LanguageRepository,

    @InjectRepository(TranslationsRepository)
    private trRepo: TranslationsRepository,

    private langService: LangService,

    @InjectRepository(ImagesRepository)
    private imgRepo: ImagesRepository,
  ) {
    super(catRepo.target, catRepo.manager, catRepo.queryRunner);
  }

  async updateCategory(id: any, updateData: UpdateCategoryDto) {
    try {
      const category = await this.catRepo.findOne({
        relations: ['translation', 'images'],
        where: {
          id,
        },
      });

      const errors = [];

      if (category) {
        // Update category properties
        category.name = updateData.name;

        // Update translations if provided
        if (updateData.translations) {
          category.translation = [];
          for (const tr of updateData.translations) {
            const language = await this.langRepo.findOne({
              where: { id: tr.language_id },
            });

            if (!language) {
              errors.push(`Language id ${tr.language_id} does not exist.`);
              continue;
            }

            const translation = new Translations();
            translation.name = tr.name;

            if (tr.description) {
              translation.description = tr.description;
            }

            translation.language = language;

            await this.trRepo.save(translation);
            category.translation.push(translation);
          }
        }

        // Update images if provided
        if (updateData.images) {
          category.images = [];
          for (const im of updateData.images) {
            const img = new Images();
            img.url = im.url;
            img.category = category;
            await this.imgRepo.save(img);
            category.images.push(img);
          }
        }

        // Save the updated Category entity to the database
        return ApiResponse.create(this.catRepo.save(category), 200);
      }

      return undefined;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getCategoryId(id: number) {
    const data = await this.catRepo.findOne({
      relations: ['translation', 'images', 'products'],
      where: {
        id,
      },
    });
    return ApiResponse.success(data);
  }
  async createCategory(req: CreateCategoryDto) {
    try {
      const { name, translations, images } = req;
      const cat = new Category();
      cat.name = name;
      await this.catRepo.save(cat);

      const errors = [];
      if (translations) {
        const translationData = [];
        for (const tr of translations) {
          const language = await this.langRepo.findOne({
            where: { id: tr.language_id },
          });

          if (!language) {
            errors.push(`Language id ${tr.language_id} does not exist.`);
            continue;
          }
          const translation = new Translations();
          translation.name = tr.name;

          if (tr.description) {
            translation.description = tr.description;
          }

          translation.language = language;
          await this.trRepo.save(translation);
          translationData.push(translation);
        }
        cat.translation = translationData;
      }
      if (images) {
        const imageData = [];
        for (const im of images) {
          const img = new Images();
          img.url = im.url;
          img.category = cat;
          await this.imgRepo.save(img);
          imageData.push(img);
        }
        cat.images = imageData;
      }
      return ApiResponse.create(
        this.catRepo.save(cat), // Use the saved category in the response
        201,
        this.langService.getTranslation('CREATED_SUCCESSFULLY', 'Currency'),
        null,
      );
    } catch (error) {
      // Handle errors appropriately, e.g., log or throw
      console.error(error);
      throw error;
    }
  }

  async deleteCategory(id: number) {
    const category = await this.catRepo.findOne({
      relations: ['translation', 'images'],
      where: { id },
    });

    if (category) {
      // Remove images and translations associated with the category
      await Promise.all(category.images.map((img) => this.imgRepo.remove(img)));
      await Promise.all(
        category.translation.map((tr) => this.trRepo.remove(tr)),
      );

      // Remove the category itself
      await this.catRepo.remove(category);
      return ApiResponse.success(null, 200, 'DELETE SUCCESS');
    }
    throw new NotFoundException({
      statusCode: 404,
      message: 'Invalid Category id',
    });
  }

  async findCategories(req: SearchCategoryDto) {
    const { name, category_id, limit, offset } = req;
    const where = {};
    if (name) {
      where['translation']['name'] = Like(name);
    }
    if (category_id) {
      where['id'] = category_id;
    }

    const [list, count] = await this.catRepo.findAndCount({
      where: where,
      relations: {
        translation: true,
        images: true,
      },
      skip: offset,
      take: limit,
    });
    return ApiResponse.paginate({ list, count });
  }
}