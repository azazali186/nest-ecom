import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';

export class CategoryRepository extends Repository<Category> {
  constructor(
    @InjectRepository(Category)
    private catRepo: Repository<Category>,
  ) {
    super(catRepo.target, catRepo.manager, catRepo.queryRunner);
  }
}
