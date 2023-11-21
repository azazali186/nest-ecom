import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Stock } from './stock.entity';
import { Currency } from './currency.entity';

@Entity()
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: string;

  @ManyToOne(() => Currency, (st) => st.id)
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @ManyToOne(() => Stock, (st) => st.price)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;
}
