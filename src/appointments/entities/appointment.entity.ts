import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AppointmentStatus {
  Scheduled = 'scheduled',
  Canceled = 'canceled',
  Done = 'done',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  patient: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  professional: User;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  status: AppointmentStatus;

  @OneToMany(() => AppointmentComment, (comment) => comment.id)
  comments: AppointmentComment[];

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
}

@Entity()
export class AppointmentComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdAt: Date;

  @Column()
  comment: string;
}
