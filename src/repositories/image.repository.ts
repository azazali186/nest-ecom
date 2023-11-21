import { InjectRepository } from '@nestjs/typeorm';
import { Images } from 'src/entities/images.entity';
import { Repository } from 'typeorm';

export class ImagesRepository extends Repository<Images> {
  constructor(
    @InjectRepository(Images)
    private imgRepo: Repository<Images>,
  ) {
    super(imgRepo.target, imgRepo.manager, imgRepo.queryRunner);
  }
}
