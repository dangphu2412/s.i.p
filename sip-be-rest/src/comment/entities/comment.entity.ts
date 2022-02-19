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

@Entity('comments')
@Tree('materialized-path')
export class Comment extends TimeEntityGenerator(TimeType.Time) {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ name: 'content', type: 'text' })
  public content: string;

  @ManyToOne(() => User, (author) => author.comments)
  public author: User;

  @ManyToOne(() => Post, (post) => post.comments)
  public post: Post;

  @TreeChildren()
  replies: Comment[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Comment;
}
