import { Field, InterfaceType } from '@nestjs/graphql';
import { AbstractTimeTrackerType } from './abstract-time-tracker.type';

@InterfaceType()
export abstract class AbstractTrashTrackerType extends AbstractTimeTrackerType {
  @Field(() => Date, { description: 'Entity deleted at', nullable: true })
  deletedAt: Date;
}
