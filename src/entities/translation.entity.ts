import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Language } from './language.entity';
import { Category } from './category.entity';

@Entity()
export class Translations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  meta_title: string;

  @Column({ nullable: true })
  meta_keywords: string;

  @Column({ nullable: true })
  meta_descriptions: string;

  @ManyToOne(() => Language, (lang) => lang.id)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @ManyToOne(() => Category, (category) => category.translations, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  categories: Category[];
}
