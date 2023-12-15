import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BulkCreateCategoryDto } from 'src/dto/category/bulk-product-upload.dto';
import { CreateCategoryDto } from 'src/dto/category/create-category.dto';
import { SearchCategoryDto } from 'src/dto/category/search-category.dto';
import { UpdateCategoryDto } from 'src/dto/category/update-category.dto';
import { CategoryRepository } from 'src/repositories/category.repository';

@Injectable()
export class CategoryService {
  updateSeo(id: number, req: import("../dto/product/update-features.dto").UpdateFeaturesDto[], user: any) {
    throw new Error('Method not implemented.');
  }
  createSeo(id: number, req: import("../dto/product/create-features.dto").CreateFeaturesDto[], user: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(CategoryRepository)
    public curRepo: CategoryRepository,
  ) {}

  create(req: CreateCategoryDto) {
    return this.curRepo.createCategory(req);
  }
  async findAll(req: SearchCategoryDto, user: any) {
    return this.curRepo.findCategories(req, user);
  }
  findOne(id: number) {
    return this.curRepo.getCategoryId(id);
  }
  update(id: any, req: UpdateCategoryDto) {
    return this.curRepo.updateCategory(id, req);
  }
  async remove(id: number) {
    return await this.curRepo.deleteCategory(id);
  }

  bulk(req: BulkCreateCategoryDto) {
    return this.curRepo.bulkCreate(req);
  }
}
