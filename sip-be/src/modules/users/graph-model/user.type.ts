import { TimeTracker } from '@database/base/time-tracker.factory';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType extends TimeTracker() {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Name of user' })
  name: string;

  @Field(() => String, { description: 'Avatar of user' })
  avatar: string;
}
