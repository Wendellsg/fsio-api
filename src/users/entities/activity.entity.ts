import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Routine } from './routine.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Routine, (routine) => routine.activities, {
    onDelete: 'CASCADE',
  })
  routine: Routine;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column()
  comments: string;

  @Column()
  painLevel: number;

  @Column()
  effortLevel: number;

  @Column({
    type: 'timestamp',
  })
  date: Date;
}
