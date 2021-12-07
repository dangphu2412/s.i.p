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

  @Column({ name: 'title', nullable: false })
  public title: string;

  @Column({ name: 'content', nullable: false })
  public content: string;

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
}
