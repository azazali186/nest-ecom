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

  @Column()
  discriptions: string;

  @Column()
  meta_title: string;

  @Column()
  meta_keywords: string;

  @Column()
  meta_discriptions: string;

  @ManyToOne(() => Language, (lang) => lang.id)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @ManyToOne(() => Stock, (st) => st.translation)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @ManyToOne(() => Product, (p) => p.translation)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Category, (c) => c.translation)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
