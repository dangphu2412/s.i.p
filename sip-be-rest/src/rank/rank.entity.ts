import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export interface PointKeyByPostId {
  [identity: string]: number;
}

@Entity({
  name: 'rank',
})
export class Rank {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({
    name: 'rank_date',
    unique: true,
    nullable: false,
  })
  @Index()
  public rankDate: Date;

  @Column({
    name: 'rankingPoints',
    type: 'simple-json',
  })
  public rankingPoints: PointKeyByPostId;
}
