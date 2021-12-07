import { TimeEntityGenerator } from '@database/base/time-entity';
import { Comment } from '@modules/comment/comment.entity';
import { Permission } from '@modules/permission/permission.entity';
import { Vote } from '@modules/vote/vote.entity';
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

  @OneToMany(() => Comment, (comment) => comment.author)
  public comments: Comment[];

  @OneToMany(() => Vote, (vote) => vote.author)
  public votes: Vote[];

  static create(partials: Partial<User>) {
    return Object.assign(new User(), partials);
  }
}
