import { TimeEntityGenerator } from '@database/base/time-entity';
import { Discussion } from '@modules/discussion/discussion.entity';
import { Topic } from '@modules/topic/topic.entity';
import { User } from '@modules/user/user.entity';
import { Vote } from '@modules/vote/vote.entity';
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

@Entity('posts')
@Index(['slug'])
export class Post extends TimeEntityGenerator() {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ name: 'title', nullable: false, unique: true })
  public title: string;

  @Column({ name: 'slug', nullable: false, unique: true })
  public slug: string;

  @Column({ name: 'content', nullable: false, type: 'text' })
  public content: string;

  @Column({ name: 'summary', type: 'text' })
  public summary: string;

  @Column({ name: 'thumbnail', nullable: false })
  public thumbnail: string;

  @Column({ name: 'preview_gallery', nullable: false, type: 'simple-array' })
  public previewGalleryImg: string;

  @Column({ name: 'gallery_images', nullable: false, type: 'simple-array' })
  public galleryImages: string[];

  @Column({ name: 'video_demo', nullable: true })
  public videoDemo: string;

  @Column({ name: 'product_link', nullable: false })
  public productLink: string;

  /**
   * START VIRTUAL FIELDS
   * FIXME: This is a work around to add virtual field mapping into entity
   */
  @Column({
    select: false,
    insert: false,
    update: false,
    name: 'is_author',
    nullable: true,
  })
  public isAuthor?: boolean;

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

  @OneToMany(() => Discussion, (discussion) => discussion.author)
  public discussions: Discussion[];

  @ManyToOne(() => User, (author) => author.posts)
  public author: User;

  public static create(partial: Partial<Post>) {
    return Object.assign(new Post(), partial);
  }
}
