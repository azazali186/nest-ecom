import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/dto/category/create-category.dto';
import { SearchCategoryDto } from 'src/dto/category/search-category.dto';
import { UpdateCategoryDto } from 'src/dto/category/update-category.dto';
import { CategoryRepository } from 'src/repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    public curRepo: CategoryRepository,
  ) {}

  create(req: CreateCategoryDto) {
    return this.curRepo.createCategory(req);
  }
  async findAll(req: SearchCategoryDto) {
    return this.curRepo.findCategories(req);
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
}
