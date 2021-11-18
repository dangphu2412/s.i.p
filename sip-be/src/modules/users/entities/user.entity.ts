import { TimeTracker } from '@database/base/time-tracker.factory';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User extends TimeTracker() {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'email',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'avatar', nullable: false })
  avatar: string;
}
