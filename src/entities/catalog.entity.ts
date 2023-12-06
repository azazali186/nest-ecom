import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { Product } from './product.entity';
import { Translations } from './translation.entity';
import { Images } from './images.entity';
import { User } from './user.entity';

@Entity('catalogs')
export class Catalog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Product, (product) => product.catalogs, {
    nullable: true,
  })
  products: Product[] | null;

  @OneToMany(() => Translations, (tr) => tr.catalogs, {
    nullable: true,
  })
  translations: Translations[] | null;

  @OneToMany(() => Images, (img) => img.catalogs)
  images: Images[] | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  created_by: User | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by_id' })
  updated_by: User | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at: Date;
}
