import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
  BaseEntity,
} from 'typeorm';
import { Product } from './product.entity';
import { Translations } from './translation.entity';
import { Images } from './images.entity';

@Entity('categories')
@Tree('closure-table', {
  closureTableName: 'category_tree',
})
export class Category extends BaseEntity {
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

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;
}
