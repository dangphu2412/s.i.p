import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class SearchCriteria {
  @Field()
  offset: number

  @Field()
  limit: number

  @Field()
  sort?: string

  @Field()
  search?: string;
}
