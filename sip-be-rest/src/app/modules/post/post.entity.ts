import { Topic } from '@modules/topic/topic.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
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
}
