import { Topic } from 'src/topic/topic.entity';
import { TimeEntityGenerator } from '@database/base/time-entity';
import { Discussion } from 'src/discussion/discussion.entity';
import { Permission } from '@modules/../permission/permission.entity';
import { Post } from 'src/post/post.entity';
import { Vote } from '@modules/../vote/vote.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User extends TimeEntityGenerator() {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ name: 'username', unique: true })
  @Index()
  public username: string;

  @Column({ name: 'full_name' })
  public fullName: string;

  @Index()
  @Column({ name: 'email', unique: true })
  public email: string;

  @Column({ name: 'password', nullable: false })
  public password: string;

  @Column({ name: 'avatar' })
  public avatar: string;

  @ManyToMany(() => Permission, (per) => per.users, { cascade: ['remove'] })
  @JoinTable({
    name: 'users_permissions',
    joinColumn: {
      name: 'users_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permissions_id',
      referencedColumnName: 'id',
    },
  })
  public permissions: Permission[];

  @OneToMany(() => Discussion, (discussion) => discussion.author)
  public discussions: Discussion[];

  @OneToMany(() => Vote, (vote) => vote.author)
  public votes: Vote[];

  @OneToMany(() => Post, (post) => post.author)
  public posts: Post[];

  @ManyToMany(() => Topic, (topic) => topic.followers)
  @JoinTable({
    name: 'users_topics',
    joinColumn: {
      name: 'users_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'topics_id',
      referencedColumnName: 'id',
    },
  })
  public followedTopics: Topic[];

  static create(partials: Partial<User>) {
    return Object.assign(new User(), partials);
  }
}
