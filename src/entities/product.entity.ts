import { ProductStatus } from '../enum/product-status.enum';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Images } from './images.entity';
import { Translations } from './translation.entity';
import { Stock } from './stock.entity';
import { Catalog } from './catalog.entity';
import { Variation } from './variations.entity';
import { Price } from './price.entity';
import { ProductFeature } from './product-features.entity';

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.STOCK,
  })
  status: ProductStatus;

  @OneToMany(() => Price, (pr) => pr.product, { nullable: true })
  price: Price[];

  @Column({ default: 1 })
  quantity: number;

  @ManyToMany(() => Variation, (pv) => pv.products)
  @JoinTable({ name: 'product_variations' })
  variations: Variation[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: 'product_category' })
  categories: Category[];

  @ManyToMany(() => Catalog, (catalog) => catalog.products)
  @JoinTable({ name: 'product_catalogs' })
  catalogs: Catalog[];

  @OneToMany(() => Translations, (tr) => tr.products, {
    nullable: true,
  })
  translations: Translations[] | null;

  @OneToMany(() => Images, (img) => img.products, {
    nullable: true,
  })
  images: Images[] | null;

  @OneToMany(() => ProductFeature, (pf) => pf.products, {
    nullable: true,
  })
  features: ProductFeature[] | null;

  @OneToMany(() => Stock, (st) => st.products)
  stocks: Stock[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  created_by: User | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by_id' })
  updated_by: User | null;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at: Date;
}
