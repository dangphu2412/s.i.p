import { TimeEntityGenerator } from '@database/base/time-entity';
import { Topic } from '@modules/topic/topic.entity';
import { Vote } from '@modules/vote/vote.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
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

  public static create(partial: Partial<Post>) {
    return Object.assign(new Post(), partial);
  }
}
