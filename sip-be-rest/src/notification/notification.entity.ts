import { TimeEntityGenerator, TimeType } from '@database/base/time-entity';
import { User } from '@user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export interface PointKeyByPostId {
  [identity: string]: number;
}

@Entity({
  name: 'notifications',
})
export class Notification extends TimeEntityGenerator(TimeType.Time) {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({
    name: 'title',
    nullable: false,
  })
  public title: string;

  @Column({
    name: 'link',
    nullable: false,
  })
  public link: string;

  @Column({
    name: 'is_read',
    default: false,
  })
  public isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications)
  public receiver: User;
}
