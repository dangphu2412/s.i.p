import { TimeEntityGenerator, TimeType } from '@database/base/time-entity';
import { Post } from '@post/post.entity';
import { User } from '@user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity('discussions')
@Tree('materialized-path')
export class Discussion extends TimeEntityGenerator(TimeType.Time) {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ name: 'content', type: 'text' })
  public content: string;

  @ManyToOne(() => User, (author) => author.discussions)
  public author: User;

  @ManyToOne(() => Post, (post) => post.discussions)
  public post: Post;

  @TreeChildren()
  replies: Discussion[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Discussion;
}
