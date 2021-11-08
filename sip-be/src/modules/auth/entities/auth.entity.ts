import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class OAuth {
  @Field(() => String, { description: 'Token take from google login' })
  token: string;
}
