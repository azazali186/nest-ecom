import { InjectRepository } from '@nestjs/typeorm';
import { CreateVariationDto } from 'src/dto/variations/create-variation.dto';
import { Variation } from 'src/entities/variations.entity';
import { Repository } from 'typeorm';

export class VariationRepository extends Repository<Variation> {
  constructor(
    @InjectRepository(Variation)
    private varRepo: Repository<Variation>,
  ) {
    super(varRepo.target, varRepo.manager, varRepo.queryRunner);
  }

  async createVar(varDto: CreateVariationDto) {
    const { name, values } = varDto;
    let variations = null;
    variations = await Promise.all(
      values.map(async (v) => {
        let variation = await this.varRepo.findOne({
          where: {
            name: name,
            value: v,
          },
        });

        if (!variation) {
          variation = new Variation();
          variation.name = name;
          variation.value = v;
          await this.varRepo.save(variation);
        }
        return variation;
      }),
    );

    return variations;
  }
}
