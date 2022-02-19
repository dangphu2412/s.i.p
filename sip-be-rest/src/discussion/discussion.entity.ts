import { DiscussionComment } from '@comment/entities/discussion-comment.entity';
import { TimeEntityGenerator, TimeType } from '@database/base/time-entity';
import { User } from '@user/user.entity';
import { DiscussionVote } from '@vote/entities/vote-discussion.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('discussions')
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

  @OneToMany(() => DiscussionComment, (comment) => comment.discussion)
  public comments: Discussion[];

  @OneToMany(() => DiscussionVote, (vote) => vote.discussion)
  public votes: DiscussionVote[];

  public totalVotes: number;
  public totalReplies: number;
}
