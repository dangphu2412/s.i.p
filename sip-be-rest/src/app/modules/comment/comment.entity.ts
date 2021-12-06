import { TimeEntityGenerator, TimeType } from '@database/base/time-entity';
import { User } from '@modules/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comment extends TimeEntityGenerator(TimeType.TimeTracker) {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ name: 'content', type: 'text' })
  public content: string;

  @ManyToOne(() => User, (author) => author.comments)
  public author: User;
}
