import { TimeTracker } from '@database/base/time-tracker.factory';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostType extends TimeTracker() {
  @Field(() => ID)
  id: number;

  @Field(() => String, { description: 'Title of user' })
  title: string;

  @Field(() => String, { description: 'Content of user' })
  content: string;
}
