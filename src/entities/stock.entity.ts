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
import { Images } from './images.entity';
import { Translations } from './translation.entity';
import { Price } from './price.entity';
import { Product } from './product.entity';
import { Variation } from './variations.entity';

@Entity()
export class Stock extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @ManyToMany(() => Variation, (pv) => pv.products)
  @JoinTable({ name: 'stock_variations' })
  variations: Variation[];

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.STOCK,
  })
  status: ProductStatus;

  @OneToMany(() => Images, (image) => image.stocks)
  images: Images[];

  @OneToMany(() => Translations, (tr) => tr.stock, {
    nullable: true,
  })
  translations: Translations[] | null;

  @OneToMany(() => Price, (pr) => pr.stock, { nullable: true })
  price: Price[];

  @Column({ default: 1 })
  quantity: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  products: Product;

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
