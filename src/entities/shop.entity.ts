import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Images } from './images.entity';

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

  @OneToOne(() => Images, { nullable: true })
  @JoinColumn({ name: 'logo_id' })
  logo: Images | null;

  @Column({ nullable: true })
  banner_id: number;

  @OneToOne(() => Images, { nullable: true })
  @JoinColumn({ name: 'banner_id' })
  banner: Images | null;

  @Column()
  vendor_id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'vendor_id' })
  vendor: User;
}
