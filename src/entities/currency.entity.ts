import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  symbol: string;
}
