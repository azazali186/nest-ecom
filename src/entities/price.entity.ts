/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { Stock } from './stock.entity';
import { Currency } from './currency.entity';
import { Product } from './product.entity';

@Entity()
export class Price extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: string;

  @ManyToOne(() => Currency, (st) => st.id)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ManyToOne(() => Stock, (st) => st.price, { nullable: true, cascade: true })
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @ManyToOne(() => Product, (pd) => pd.price, { nullable: true, cascade: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  toJSON() {
    // Exclude the circular reference to the parent Product
    const { product, stock, ...rest } = this;
    return rest;
  }
}
