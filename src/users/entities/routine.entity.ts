import { Exercise } from 'src/exercises/entities/exercise.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from './activity.entity';
import { User } from './user.entity';

export enum FrequencyType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

export enum PeriodType {
  MORNING = 'morning',
  AFTERNOON = 'afternoon',
  NIGHT = 'night',
}

@Entity()
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  professional: User;

  @ManyToOne(() => User, (user) => user.routines, {
    onDelete: 'CASCADE', // Adicione esta linha se quiser que as rotinas sejam excluídas quando um usuário for excluído
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Exercise, (exercise) => exercise.id)
  exercise: Exercise;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column()
  description: string;

  @Column()
  frequency: number;

  @Column({
    type: 'enum',
    enum: FrequencyType,
    default: FrequencyType.DAY,
  })
  frequencyType: FrequencyType;

  @Column()
  repetitions: number;

  @Column()
  series: number;

  @Column({
    type: 'enum',
    enum: PeriodType,
    default: PeriodType.MORNING,
  })
  period: PeriodType;

  @OneToMany(() => Activity, (activity) => activity.routine, {
    eager: true,
    nullable: true,
  })
  activities: Activity[];
}
