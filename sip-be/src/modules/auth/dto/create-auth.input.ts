import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class AuthInput {
  @Field(() => String, {
    description: 'Access token from third party',
    nullable: false,
  })
  @IsNotEmpty()
  accessToken: string;
}
