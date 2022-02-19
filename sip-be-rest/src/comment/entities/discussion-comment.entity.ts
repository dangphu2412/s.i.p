import { TimeEntityGenerator, TimeType } from '@database/base/time-entity';
import { Discussion } from '@discussion/discussion.entity';
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

@Entity('discussion_comments')
@Tree('materialized-path')
export class DiscussionComment extends TimeEntityGenerator(TimeType.Time) {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ name: 'content', type: 'text' })
  public content: string;

  @ManyToOne(() => User, (author) => author.discussionComments)
  public author: User;

  @ManyToOne(() => Post, (post) => post.comments)
  public discussion: Discussion;

  @TreeChildren()
  public replies: DiscussionComment[];

  @TreeParent({ onDelete: 'CASCADE' })
  public parent: DiscussionComment;
}
