import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  Column,
  BaseEntity,
} from 'typeorm';
import { Product } from './product.entity';
import { Stock } from './stock.entity';

@Entity('variations')
export class Variation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToMany(() => Product, (product) => product.variations, {
    nullable: true,
  })
  products: Product[] | null;

  @ManyToMany(() => Stock, (stock) => stock.variations, {
    nullable: true,
  })
  stocks: Stock[] | null;

  quantity: number;
}
