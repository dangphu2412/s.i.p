import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TopicType {
  @Field(() => ID, { description: 'Id of topic' })
  public id: string;

  @Field(() => String, { description: 'Name of topic' })
  public name: string;
}
