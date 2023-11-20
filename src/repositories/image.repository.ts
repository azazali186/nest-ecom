import { InjectRepository } from '@nestjs/typeorm';
import { Img } from 'src/entities/img.entity';
import { Repository } from 'typeorm';

export class ImgRepository extends Repository<Img> {
  constructor(
    @InjectRepository(Img)
    private imgRepo: Repository<Img>,
  ) {
    super(imgRepo.target, imgRepo.manager, imgRepo.queryRunner);
  }
}
