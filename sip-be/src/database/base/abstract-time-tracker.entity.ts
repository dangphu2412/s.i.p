import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractTimeTrackerEntity {
  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
  })
  updatedAt: Date;
}
