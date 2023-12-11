import {
  Entity,
  BaseEntity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { Product } from './product.entity';
import { Translations } from './translation.entity';

@Entity('product-features')
export class ProductFeature extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type' })
  type: string;

  @JoinColumn({ name: 'product_id' })
  products: Product;

  @OneToMany(() => Translations, (tr) => tr.product_feature, {
    nullable: true,
  })
  translations: Translations[] | null;
}
