import { Post } from '@modules/post/post.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ name: 'name', unique: true })
  public name: string;

  @Column({ name: 'slug', nullable: false })
  public slug: string;

  @Column({ name: 'summary', nullable: false })
  public summary: string;

  @ManyToMany(() => Post, (post) => post.topics)
  public posts: Post[];

  @ManyToMany(() => User, (user) => user.followedTopics)
  public followers: User[];
}
