import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { Translations } from './translation.entity';
import { Img } from './img.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Product, (product) => product.categories, {
    nullable: true,
  })
  products: Product[] | null;

  @OneToMany(() => Translations, (tr) => tr.category)
  translation: Translations[];

  @OneToMany(() => Img, (image) => image.category, { nullable: true })
  images: Img[] | null;
}
