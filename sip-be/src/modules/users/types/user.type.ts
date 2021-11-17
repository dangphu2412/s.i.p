import { AbstractTrashTrackerType } from '@database/base/abstract-trash-tracker.type';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType extends AbstractTrashTrackerType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Name of user' })
  name: string;

  @Field(() => String, { description: 'Avatar of user' })
  avatar: string;
}
