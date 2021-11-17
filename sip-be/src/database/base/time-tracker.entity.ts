import { Field, InterfaceType } from '@nestjs/graphql';
import { DeleteDateColumn } from 'typeorm';
import { UpdateTracker } from './update-tracker.entity';

@InterfaceType()
export class TimeTracker extends UpdateTracker {
  @Field(() => Date, { description: 'Entity deleted at', nullable: true })
  @DeleteDateColumn({ name: 'deleted_at', nullable: true, default: null })
  deletedAt: Date;
}
