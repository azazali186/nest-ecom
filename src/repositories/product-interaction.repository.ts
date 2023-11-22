import { InjectRepository } from '@nestjs/typeorm';
import { ProductInteraction } from 'src/entities/product-interaction.entity';
import { Product } from 'src/entities/product.entity';
import { Session } from 'src/entities/session.entity';
import { ProductInteractionTypeEnum } from 'src/enum/product-interation-type.enum';
import { getIntractionValue } from 'src/utils/brain.utils';
import { Repository } from 'typeorm';

export class ProductInterationRepository extends Repository<ProductInteraction> {
  constructor(
    @InjectRepository(ProductInteraction)
    private intRepo: Repository<ProductInteraction>,
  ) {
    super(intRepo.target, intRepo.manager, intRepo.queryRunner);
  }

  async createInteraction(req: {
    product: Product;
    user: any;
    type: ProductInteractionTypeEnum;
  }) {
    const { product, user, type } = req;

    const interaction = new ProductInteraction();
    interaction.product = product;
    interaction.user = user;
    interaction.type = type;
    interaction.rating = await getIntractionValue(type);
    await this.intRepo.save(interaction);
    return interaction;
  }
}
