import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  Column,
  OneToMany,
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

  @OneToMany(() => Stock, (stock) => stock.variation)  
  stocks: Stock[];
}
