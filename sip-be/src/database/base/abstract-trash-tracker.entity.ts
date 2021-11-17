import { DeleteDateColumn } from 'typeorm';
import { AbstractTimeTrackerEntity } from './abstract-time-tracker.entity';

export abstract class AbstractTrashTrackerEntity extends AbstractTimeTrackerEntity {
  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: false,
  })
  deletedAt: Date;
}
