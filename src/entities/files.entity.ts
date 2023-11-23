import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MediaTypeEnum } from 'src/enum/media-type.enum';
import { User } from './user.entity';

@Entity()
export class Files {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  file_name: string;

  @Column({ default: MediaTypeEnum.IMAGES })
  media_type: string;

  @Column({ nullable: true })
  extention: string;

  @Column({ nullable: true })
  size: string;

  @Column({ nullable: true })
  original_file_name: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  uploaded_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at: Date;
}