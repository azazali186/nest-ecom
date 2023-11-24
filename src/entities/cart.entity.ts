import { Entity, Column } from 'typeorm';
import { CommonProduct } from './common-product-entity.entity';
import { CartStatusEnum } from 'src/enum/cart-status.enum';

@Entity('carts')
export class Cart extends CommonProduct {
  @Column({ default: 1 })
  quantity: number;

  @Column({
    type: 'enum',
    enum: CartStatusEnum,
    default: CartStatusEnum.PENDING,
  })
  status: CartStatusEnum;
}
