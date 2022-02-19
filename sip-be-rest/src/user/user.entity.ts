import { DiscussionVote } from '@vote/entities/vote-discussion.entity';
import { TimeEntityGenerator } from '@database/base/time-entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Discussion } from 'src/discussion/discussion.entity';
import { Permission } from '@permission/permission.entity';
import { Post } from '@post/post.entity';
import { Topic } from '@topic/topic.entity';
import { Vote } from '@vote/entities/vote.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiscussionComment } from '@comment/entities/discussion-comment.entity';

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
  @Column({ name: 'hash_tag' })
  public hashTag: string;

  @Index()
  @Column({ name: 'email', unique: true })
  public email: string;

  @Column({ name: 'password', nullable: false })
  public password: string;

  @Column({ name: 'avatar' })
  public avatar: string;

  @Column({ name: 'headline' })
  public headline: string;

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

  @OneToMany(() => Comment, (comment) => comment.author)
  public comments: Comment[];

  @OneToMany(
    () => DiscussionComment,
    (discussionComment) => discussionComment.author,
  )
  public discussionComments: DiscussionComment[];

  @OneToMany(() => Discussion, (discussion) => discussion.author)
  public discussions: Discussion[];

  @OneToMany(() => Vote, (vote) => vote.author)
  public votes: Vote[];

  @OneToMany(() => DiscussionVote, (discussionVote) => discussionVote.author)
  public discussionVotes: DiscussionVote[];

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

  @ManyToMany(() => Post, (post) => post.makers)
  public joinedProducts: Post[];

  static create(partials: Partial<User>) {
    return Object.assign(new User(), partials);
  }
}
