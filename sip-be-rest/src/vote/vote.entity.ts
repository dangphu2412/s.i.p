import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Unique('once_per_author', ['author', 'post'])
@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ name: 'is_voted', default: true })
  public isVoted: boolean;

  @ManyToOne(() => User, (user) => user.votes, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  public author: User;

  @ManyToOne(() => Post, (post) => post.votes, { nullable: false })
  @JoinColumn({ name: 'post_id' })
  public post: Post;
}
