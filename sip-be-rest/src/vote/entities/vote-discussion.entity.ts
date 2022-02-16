import { Discussion } from '@discussion/entities/discussion.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Unique('once_vote_discussion_per_author', ['author', 'discussion'])
@Entity('discussion_votes')
export class DiscussionVote {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ name: 'is_voted', default: true })
  public isVoted: boolean;

  @ManyToOne(() => User, (user) => user.votes, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  public author: User;

  @ManyToOne(() => Discussion, (discussion) => discussion.votes, {
    nullable: false,
  })
  @JoinColumn({ name: 'discussion_id' })
  public discussion: Discussion;
}
