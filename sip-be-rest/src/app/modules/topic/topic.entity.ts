import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ name: 'name', unique: true })
  public name: string;

  @Column({ name: 'slug', nullable: true })
  public slug: string;
}
