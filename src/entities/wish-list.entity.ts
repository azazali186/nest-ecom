import { Entity } from 'typeorm';
import { CommonProduct } from './common-product-entity.entity';

@Entity('wish-list')
export class WishList extends CommonProduct {

}
