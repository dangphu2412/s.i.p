import { Post } from '@modules/post/post.entity';
import { User } from '@modules/user/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  public id: string;

  @ManyToOne(() => User, (user) => user.votes)
  @JoinColumn({ name: 'author_id' })
  public author: User;

  @ManyToOne(() => Post, (post) => post.votes)
  @JoinColumn({ name: 'post_id' })
  public post: Post;
}
