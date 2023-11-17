import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entities/image.entity';
import { Repository } from 'typeorm';

export class ImageRepository extends Repository<Image> {
  constructor(
    @InjectRepository(Image)
    private imgRepo: Repository<Image>,
  ) {
    super(imgRepo.target, imgRepo.manager, imgRepo.queryRunner);
  }
}
