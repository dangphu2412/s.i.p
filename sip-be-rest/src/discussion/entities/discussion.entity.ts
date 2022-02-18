import { TimeEntityGenerator, TimeType } from '@database/base/time-entity';
import { User } from '@user/user.entity';
import { DiscussionVote } from '@vote/entities/vote-discussion.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
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

  @Column({ name: 'title', nullable: false })
  public title: string;

  @Column({ name: 'slug', nullable: false })
  public slug: string;

  @Column({ name: 'content', type: 'text' })
  public content: string;

  @ManyToOne(() => User, (author) => author.discussions)
  public author: User;

  @TreeChildren()
  public replies: Discussion[];

  @TreeParent({ onDelete: 'CASCADE' })
  public parent: Discussion;

  @OneToMany(() => DiscussionVote, (vote) => vote.discussion)
  public votes: DiscussionVote[];

  public totalVotes: number;
  public totalReplies: number;
}
