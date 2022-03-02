import { TimeEntityGenerator, TimeType } from '@database/base/time-entity';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('topics')
export class Topic extends TimeEntityGenerator(TimeType.Time) {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ name: 'name', unique: true })
  public name: string;

  @Column({ name: 'slug', nullable: false })
  public slug: string;

  @Column({ name: 'summary', nullable: false })
  public summary: string;

  @Column({ name: 'avatar', nullable: false })
  public avatar: string;

  @ManyToMany(() => Post, (post) => post.topics)
  public posts: Post[];

  @ManyToMany(() => User, (user) => user.followedTopics)
  public followers: User[];
}
