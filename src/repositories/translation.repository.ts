import { InjectRepository } from '@nestjs/typeorm';
import { Translations } from 'src/entities/translation.entity';
import { Repository } from 'typeorm';

export class TranslationsRepository extends Repository<Translations> {
  constructor(
    @InjectRepository(Translations)
    private transRepo: Repository<Translations>,
  ) {
    super(transRepo.target, transRepo.manager, transRepo.queryRunner);
  }
}
