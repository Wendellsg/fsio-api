import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Category {
  LEGS = 'legs',
  ARMS = 'arms',
  BACK = 'back',
  CHEST = 'chest',
  SHOULDERS = 'shoulders',
  ABS = 'abs',
  CARDIO = 'cardio',
}

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  description: string;

  /*  @ManyToOne(() => User, (user) => user.favoriteExercises)
  @JoinColumn()
  professionals: User[]; */

  @Column({
    type: 'enum',
    enum: Category,
    nullable: false,
  })
  category: Category;

  @Column()
  image: string;

  @Column()
  video: string;

  @Column()
  summary: string;

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
