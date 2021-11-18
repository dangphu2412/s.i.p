import { TimeTracker } from '@database/base/time-tracker.factory';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posts')
export class Post extends TimeTracker() {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'title',
    nullable: false,
    unique: true,
  })
  @Index()
  title: string;

  @Column({ name: 'content', nullable: false, type: 'text' })
  content: string;
}
