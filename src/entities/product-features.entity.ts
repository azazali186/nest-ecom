import {
  Entity,
  BaseEntity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { Translations } from './translation.entity';

@Entity('product-features')
export class ProductFeature extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'product_id' })
  products: Product;

  @OneToMany(() => Translations, (tr) => tr.product_feature, {
    nullable: true,
  })
  translations: Translations[] | null;
}
