import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Product } from './product.entity';
import { Stock } from './stock.entity';
import { Catalog } from './catalog.entity';
@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Category, (cat) => cat.images, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  categories: Category;

  @ManyToOne(() => Product, (prod) => prod.images, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  products: any;

  @ManyToOne(() => Stock, (prod) => prod.images, { nullable: true })
  @JoinColumn({ name: 'stock_id' })
  stocks: any;

  @ManyToOne(() => Catalog, (cat) => cat.images, { nullable: true })
  @JoinColumn({ name: 'catalog_id' })
  catalogs: Catalog;

}
