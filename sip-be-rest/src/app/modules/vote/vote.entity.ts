import { Post } from '@modules/post/post.entity';
import { User } from '@modules/user/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('votes')
export class Vote {
  @PrimaryGeneratedColumn()
  public id: string;

  @ManyToOne(() => User, (user) => user.votes)
  public author: User;

  @ManyToOne(() => Post, (post) => post.votes)
  public post: Post;
}
