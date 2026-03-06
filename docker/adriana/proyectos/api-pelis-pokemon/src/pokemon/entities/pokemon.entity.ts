import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  type: string;

  @Column({ type: 'int' })
  hp: number;

  @Column({ type: 'int', default: 1 })
  level: number;
}