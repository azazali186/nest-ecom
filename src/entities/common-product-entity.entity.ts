import { PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./product.entity";
import { User } from "./user.entity";

export abstract class CommonProduct {
    @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (pd) => pd.id, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, (pd) => pd.id, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}