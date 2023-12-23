/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  BaseEntity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  Column,
  ManyToOne,
} from 'typeorm';
import { Product } from './product.entity';
import { Translations } from './translation.entity';

@Entity('product_features')
export class ProductFeature extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type' })
  type: string;

  @ManyToOne(() => Product, (pd) => pd.features, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  products: Product;

  @OneToMany(() => Translations, (tr) => tr.product_feature, {
    nullable: true,
  })
  translations: Translations[] | null;

  toJSON() {
    // Exclude the circular reference to the parent Product
    const { products, ...rest } = this;
    return rest;
  }
}
