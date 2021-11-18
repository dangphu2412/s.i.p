import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'topics' })
export class Topic {
  @PrimaryGeneratedColumn('increment')
  public id: string;

  @Column({ name: 'name' })
  public name: string;
}
