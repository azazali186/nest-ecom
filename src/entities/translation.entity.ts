import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Language } from './language.entity';
import { Category } from './category.entity';
import { Product } from './product.entity';
import { Stock } from './stock.entity';
import { Catalog } from './catalog.entity';

@Entity()
export class Translations extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  meta_title: string;

  @Column({ nullable: true })
  meta_keywords: string;

  @Column({ nullable: true })
  meta_descriptions: string;

  @ManyToOne(() => Language, (lang) => lang.id)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @ManyToOne(() => Category, (category) => category.translations, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  categories: Category;

  @ManyToOne(() => Product, (product) => product.translations, {
    nullable: true,
  })
  @JoinColumn({ name: 'product_id' })
  products: Product;

  @ManyToOne(() => Stock, (st) => st.translations, { nullable: true })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @ManyToOne(() => Catalog, (category) => category.translations, {
    nullable: true,
  })
  @JoinColumn({ name: 'catalog_id' })
  catalogs: Catalog;

}
