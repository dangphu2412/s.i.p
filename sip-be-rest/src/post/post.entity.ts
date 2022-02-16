import { TimeEntityGenerator } from '@database/base/time-entity';
import { Comment } from '@discussion/entities/comment.entity';
import { Vote } from '@vote/entities/vote.entity';
import { Topic } from 'src/topic/topic.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  PostStatus,
  PricingType,
  ProductRunningStatus,
} from './enums/post-status.enum';

@Entity('posts')
@Index(['slug'])
export class Post extends TimeEntityGenerator() {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({
    name: 'title',
    nullable: false,
    unique: true,
  })
  public title: string;

  @Column({
    name: 'slug',
    nullable: false,
    unique: true,
  })
  public slug: string;

  @Column({ name: 'summary' })
  public summary: string;

  @Column({ name: 'description', nullable: false, type: 'text' })
  public description: string;

  @Column({ name: 'product_link', nullable: false })
  public productLink: string;

  @Column({ name: 'facebook_link', nullable: false })
  public facebookLink: string;

  @Column({ name: 'video_demo', nullable: true })
  public videoLink: string;

  @Column({ name: 'thumbnail' })
  public thumbnail: string;

  @Column({ name: 'social_preview_image' })
  public socialPreviewImage: string;

  @Column({ name: 'gallery_images', nullable: false, type: 'simple-array' })
  public galleryImages: string[];

  @Column({ name: 'is_author_also_maker', type: 'boolean' })
  public isAuthorAlsoMaker: boolean;

  @Column({ name: 'status', type: 'enum', enum: PostStatus })
  public status: PostStatus;

  @Column({ name: 'running_status', type: 'enum', enum: ProductRunningStatus })
  public runningStatus: ProductRunningStatus;

  @Column({ name: 'pricing_type', type: 'enum', enum: PricingType })
  public pricingType: PricingType;

  public isVoted?: boolean;

  @Column({
    select: false,
    insert: false,
    update: false,
    name: 'total_votes',
    nullable: true,
  })
  public totalVotes?: number;
  /**
   * END VIRTUAL FIELDS
   */

  @ManyToMany(() => Topic, (topic) => topic.posts)
  @JoinTable({
    name: 'posts_topics',
    joinColumn: {
      name: 'posts_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'topics_id',
      referencedColumnName: 'id',
    },
  })
  public topics: Topic[];

  @OneToMany(() => Vote, (vote) => vote.post)
  public votes: Vote[];

  @OneToMany(() => Comment, (comment) => comment.author)
  public comments: Comment[];

  @ManyToOne(() => User, (author) => author.posts)
  public author: User;

  @ManyToMany(() => User, (maker) => maker.joinedProducts)
  @JoinTable({
    name: 'product_makers',
    joinColumn: {
      name: 'posts_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'makers_id',
      referencedColumnName: 'id',
    },
  })
  public makers: User[];

  public static create(partial: Partial<Post>) {
    return Object.assign(new Post(), partial);
  }
}
