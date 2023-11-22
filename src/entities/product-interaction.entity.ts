// product-interaction.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity'; // Assuming you have a Product entity
import { ProductInteractionTypeEnum } from 'src/enum/product-interation-type.enum';
import { User } from './user.entity';

@Entity()
export class ProductInteraction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' }) // Many interactions can be associated with one product
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, { onDelete: 'CASCADE' }) // Many interactions can be associated with one product
  @JoinColumn({ name: 'user_id' })
  user: User; // ID of the user who performed the interaction

  @Column({ type: 'enum', enum: ProductInteractionTypeEnum, default: ProductInteractionTypeEnum.views })
  type: ProductInteractionTypeEnum; // Example interaction types

  @Column({ default: 1 })
  rating: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
