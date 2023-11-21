import { ProductStatus } from 'src/enum/product-status.enum';
import {
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Images } from './images.entity';
import { Translations } from './translation.entity';
import { Price } from './price.entity';

export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.STOCK,
  })
  status: ProductStatus;

/*   @OneToMany(() => Images, (image) => image.target)
  images: Images[]; */

 /*  @OneToMany(() => Translations, (tr) => tr.stock)
  translation: Translations[]; */

/*   @OneToMany(() => Price, (pr) => pr.stock)
  price: Price[]; */

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  created_by: User | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by_id' })
  updated_by: User | null;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at: Date;
}
