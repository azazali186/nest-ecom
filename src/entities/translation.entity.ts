import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Stock } from './stock.entity';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { Language } from './language.entity';

@Entity()
export class Translations {
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

  @ManyToOne(() => Stock, (st) => st.translation, { nullable: true })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock | null;

  @ManyToOne(() => Product, (p) => p.translation, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product | null;

  @ManyToOne(() => Category, (c) => c.translation, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;
}
