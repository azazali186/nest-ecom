import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/entities/session.entity';
import { Repository } from 'typeorm';

export class VariationRepository extends Repository<Session> {
  constructor(
    @InjectRepository(Session)
    private varRepo: Repository<Session>,
  ) {
    super(
      varRepo.target,
      varRepo.manager,
      varRepo.queryRunner,
    );
  }
}
