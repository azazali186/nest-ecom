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
import { Category } from './category.entity';

@Entity('seo')
export class Seo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (pd) => pd.seo, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  products: Product;

  @ManyToOne(() => Category, (cat) => cat.seo, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Translations, (tr) => tr.seo, {
    nullable: true,
  })
  translations: Translations[] | null;

  toJSON() {
    // Exclude the circular reference to the parent Product
    const { products, ...rest } = this;
    return rest;
  }
}
