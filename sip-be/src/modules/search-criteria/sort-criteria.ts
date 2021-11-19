import { Field, ObjectType } from '@nestjs/graphql';

export enum Direction {}

@ObjectType()
export class SortCriteria {
  @Field(() => Direction)
  direction: Direction;

  @Field(() => String)
  fieldName: string;
}
