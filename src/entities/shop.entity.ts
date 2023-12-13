import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shop')
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
