import { Field, ObjectType } from '@nestjs/graphql';

export enum Comparator {}

@ObjectType()
export class FilterCriteria {
  @Field(() => String)
  field: string;

  @Field(() => String)
  comparator: Comparator;

  @Field(() => String)
  value: string;
}
