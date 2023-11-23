import { Entity, PrimaryGeneratedColumn, ManyToMany, Column } from 'typeorm';
import { Product } from './product.entity';

@Entity('variations')
export class Variation {
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
}
