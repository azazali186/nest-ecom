import { InjectRepository } from '@nestjs/typeorm';
import { Language } from 'src/entities/language.entity';
import { Repository } from 'typeorm';

export class LanguageRepository extends Repository<Language> {
  constructor(
    @InjectRepository(Language)
    private langRepo: Repository<Language>,
  ) {
    super(langRepo.target, langRepo.manager, langRepo.queryRunner);
  }
}
