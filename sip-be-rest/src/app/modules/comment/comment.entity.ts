import { TimeEntityGenerator, TimeType } from '@database/base/time-entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comment extends TimeEntityGenerator(TimeType.TimeTracker) {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ name: 'content' })
  public content: string;
}
