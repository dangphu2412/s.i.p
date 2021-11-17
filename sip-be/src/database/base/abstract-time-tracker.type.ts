import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class AbstractTimeTrackerType {
  @Field(() => Date, { description: 'Entity created at' })
  createdAt: Date;

  @Field(() => Date, { description: 'Entity updated at' })
  updatedAt: Date;
}
