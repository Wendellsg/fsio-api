import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Role {
  PATIENT = 'patient',
  PROFESSIONAL = 'professional',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  resetPasswordToken: string;

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
  image: string;

  @Column()
  introduction: string;

  @Column()
  phone: string;

  @Column()
  profession: string;

  @Column()
  professionalLicense: string;

  @Column()
  professionalLicenseState: string;

  @Column()
  professionalLicenseImage: string;

  @Column()
  professionalVerifiedAt: Date;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PATIENT,
  })
  role: Role;

  @Column()
  height: number;

  @Column()
  weight: number;

  @Column()
  address: string;

  @Column()
  addressNumber: string;

  @Column()
  addressComplement: string;

  @Column()
  addressNeighborhood: string;

  @Column()
  addressCity: string;

  @Column()
  addressState: string;

  @Column()
  addressCountry: string;

  @Column()
  zipCode: string;

  @Column()
  birthDate: string;

  @OneToMany(() => Exercise, (exercise) => exercise.id)
  favoriteExercises: Exercise[];

  @OneToMany(() => Routine, (routine) => routine.user, {
    eager: true,
  })
  routines: Routine[];

  @OneToMany(() => User, (user) => user.id)
  patients: User[];

  @OneToMany(() => Appointment, (appointment) => appointment.professional)
  professionalAppointments: Appointment[];
}

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
  @JoinColumn()
  professional: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Exercise, (exercise) => exercise.id)
  @JoinColumn()
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

  @OneToMany(() => Activity, (activity) => activity, {
    eager: true,
  })
  activities: Activity[];
}

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Routine, (routine) => routine.id)
  @JoinColumn()
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
}
