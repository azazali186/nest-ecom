import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { Translations } from './translation.entity';
import { Images } from './images.entity';

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

  @OneToMany(() => Translations, (tr) => tr.categories, {
    nullable: true,
  })
  translations: Translations[] | null;

  @OneToMany(() => Images, (img) => img.categories)
  images: Images[] | null;
}
