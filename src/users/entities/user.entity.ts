import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Exercise } from 'src/exercises/entities/exercise.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Routine } from './routine.entity';

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

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
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

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    nullable: true,
  })
  introduction: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  profession: string;

  @Column({
    nullable: true,
  })
  professionalLicense: string;

  @Column({
    nullable: true,
  })
  professionalLicenseState: string;

  @Column({
    nullable: true,
  })
  professionalLicenseImage: string;

  @Column({
    nullable: true,
  })
  professionalVerifiedAt: Date;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PATIENT,
  })
  role: Role;

  @Column({
    nullable: true,
  })
  height: number;

  @Column({
    nullable: true,
  })
  weight: number;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  addressNumber: string;

  @Column({
    nullable: true,
  })
  addressComplement: string;

  @Column({
    nullable: true,
  })
  addressNeighborhood: string;

  @Column({
    nullable: true,
  })
  addressCity: string;

  @Column({
    nullable: true,
  })
  addressState: string;

  @Column({
    nullable: true,
  })
  addressCountry: string;

  @Column({
    nullable: true,
  })
  zipCode: string;

  @Column({
    nullable: true,
  })
  birthDate: string;

  @OneToMany(() => Exercise, (exercise) => exercise.id)
  favoriteExercises: Exercise[];

  @OneToMany(() => Routine, (routine) => routine.user, {
    eager: true,
    nullable: true,
  })
  routines: Routine[];

  @ManyToMany(() => User, (user) => user.professionals)
  @JoinTable()
  patients: User[];

  @ManyToMany(() => User, (user) => user.patients)
  @JoinTable()
  professionals: User[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => Appointment, (appointment) => appointment.professional)
  professionalAppointments: Appointment[];
}
