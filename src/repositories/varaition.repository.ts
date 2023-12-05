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
    const { name, values, qty } = varDto;
    let variations = null;
    if (values.length === qty.length) {
      variations = await Promise.all(
        values.map(async (v, index) => {
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
          variation.quantity = qty[index] || qty[0];
          return variation;
        }),
      );
    }

    return variations;
  }
}
