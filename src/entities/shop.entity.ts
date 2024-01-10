import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Files } from './files.entity';

@Entity('shop')
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  logo_id: number;

  @OneToOne(() => Files, { nullable: true })
  @JoinColumn({ name: 'logo_id' })
  logo: Files | null;

  @Column({ nullable: true })
  banner_id: number;

  @OneToOne(() => Files, { nullable: true })
  @JoinColumn({ name: 'banner_id' })
  banner: Files | null;

  @Column()
  vendor_id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'vendor_id' })
  vendor: User;
}
