import { ArgsType, Field } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { FilterCriteria } from './filter-criteria';
import { SortCriteria } from './sort-criteria';

@ArgsType()
export class SearchCriteria {
  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
  offset = 1;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
  limit = 10;

  @Field(() => [SortCriteria], { nullable: true })
  @IsOptional({ each: true })
  @IsString({ each: true })
  sorts?: SortCriteria[];

  @Field(() => [FilterCriteria], { nullable: true })
  @IsOptional({ each: true })
  @IsString({ each: true })
  filters?: FilterCriteria[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;
}
