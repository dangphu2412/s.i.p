import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TestType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Name of user', nullable: true })
  title?: string;
}
