/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/dto/category/create-category.dto';
import { SearchCategoryDto } from 'src/dto/category/search-category.dto';
import { UpdateCategoryDto } from 'src/dto/category/update-category.dto';
import { Category } from 'src/entities/category.entity';
import { Translations } from 'src/entities/translation.entity';
import { ApiResponse } from 'src/utils/response.util';
import { Like, Repository } from 'typeorm';
import { LanguageRepository } from './language.repository';
import { LangService } from 'src/services/lang.service';
import { Images } from 'src/entities/images.entity';
import { NotFoundException } from '@nestjs/common';
import { BulkCreateCategoryDto } from 'src/dto/category/bulk-product-upload.dto';

export class CategoryRepository extends Repository<Category> {
  constructor(
    @InjectRepository(Category)
    private catRepo: Repository<Category>,

    @InjectRepository(LanguageRepository)
    private langRepo: LanguageRepository,

    @InjectRepository(Translations)
    private trRepo: Repository<Translations>,

    private langService: LangService,

    @InjectRepository(Images)
    private imgRepo: Repository<Images>,
  ) {
    super(catRepo.target, catRepo.manager, catRepo.queryRunner);
  }

  async updateCategory(id: any, updateData: UpdateCategoryDto) {
    try {
      const category = await this.catRepo.findOne({
        relations: ['translations', 'images'],
        where: {
          id,
        },
      });

      const errors = [];

      if (category) {
        // Update category properties
        if(updateData.name)
        category.name = updateData.name;

        if(updateData.slug)
        category.slug = updateData.slug;

        // Update translations if provided
        if (updateData.translations) {
          category.translations = [];
          for (const tr of updateData.translations) {
            if (tr.id) {
              const trData = await this.trRepo.findOne({
                where: { id: tr.id },
              });
              trData.name = tr.name;
              await trData.save();
              category.translations.push(trData);
            } else {
              const language = await this.langRepo.findOne({
                where: { code: tr.language_code },
              });

              if (!language) {
                errors.push(`Language id ${tr.language_code} does not exist.`);
                continue;
              }

              const translation = new Translations();
              translation.name = tr.name;

              if (tr.description) {
                translation.description = tr.description;
              }

              translation.language = language;

              await this.trRepo.save(translation);
              category.translations.push(translation);
            }
          }
        }

        // Update images if provided
        if (updateData.images) {
          // category.images = [];
          for (const im of updateData.images) {
            const img = new Images();
            img.url = im.url;
            // img.category = category;
            await this.imgRepo.save(img);
            // category.images.push(img);
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
      relations: ['translations', 'images', 'products'],
      where: {
        id: id,
      },
    });
    return ApiResponse.success(data);
  }
  async createCategory(req: CreateCategoryDto) {
    try {
      const { name, translations, images, slug } = req;
      const cat = new Category();
      cat.name = name;
      cat.slug = slug;
      await this.catRepo.save(cat);

      const errors = [];
      if (translations) {
        const translationData = [];
        for (const tr of translations) {
          const language = await this.langRepo.findOne({
            where: { code: tr.language_code },
          });

          if (!language) {
            errors.push(`Language id ${tr.language_code} does not exist.`);
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
        cat.translations = translationData;
      }
      if (images) {
        const imageData = [];
        for (const im of images) {
          const img = new Images();
          img.url = im.url;
          img.categories = cat;
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
      relations: ['translations', 'images'],
      where: { id },
    });

    if (category) {
      // Remove images and translations associated with the category
      await Promise.all(category.images.map((img) => this.imgRepo.remove(img)));
      await Promise.all(
        category.translations.map((tr) => this.trRepo.remove(tr)),
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

  async findCategories(req: SearchCategoryDto, user: any) {
    const lang = user?.lang || 'en';

    let langWhere: any = true;
    if (user === null || user?.roles?.name == process.env.MEMBER_ROLE_NAME) {
      langWhere = {
        code: lang,
      };
    }

    const { name, category_id, limit, offset } = req;
    const where: any = {
      translations: {
        language: langWhere,
      },
    };
    if (name) {
      where['translations']['name'] = Like('%' + name + '%');
    }
    if (category_id) {
      where['id'] = category_id;
    }

    const [list, count] = await this.catRepo.findAndCount({
      select: {
        id: true,
        name: true,
        slug: true,
        translations: {
          id: true,
          name: true,
        },
        images: {
          id: true,
          url: true,
        },
        products: {
          id: true,
        },
      },
      where: where,
      relations: {
        translations: {
          language: true,
        },
        images: true,
        products: true,
      },
      skip: offset,
      take: limit,
      order: {
        id: 'DESC',
      },
    });
    return ApiResponse.paginate({ list, count });
  }

  bulkCreate(req: BulkCreateCategoryDto) {
    const data = [];
    const error = [];
    req.data.map(async (createProductDto) => {
      try {
        const prod = await this.createCategory(createProductDto);
        data.push(prod.data);
      } catch (e) {
        error.push({ name: createProductDto.name, error: e });
      }
    });
    return ApiResponse.success(data, 200, 'Success', error);
  }

  async findAllCat() {
    // Update category properties
    const [list, count] = await this.catRepo.findAndCount({
      select: {
        id: true,
        translations: {
          id: true,
          name: true,
        },
      },
      relations: {
        translations: {
          language: true,
        },
      },
      order: {
        id: 'DESC',
      },
    });
    return ApiResponse.paginate({ list, count });
  }
}
