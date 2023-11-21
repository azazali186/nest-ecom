import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Category, (cat) => cat.images, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  categories: Category;
}
