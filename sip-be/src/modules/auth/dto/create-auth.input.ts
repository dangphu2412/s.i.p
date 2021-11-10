import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthInput {
  @Field(() => String, { description: 'Access token from third party' })
  accessToken: string;
}
