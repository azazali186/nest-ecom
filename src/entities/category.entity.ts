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

@Entity()
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

  @OneToMany(() => Images, (image) => image.category, { nullable: true })
  images: Images[] | null;
}
