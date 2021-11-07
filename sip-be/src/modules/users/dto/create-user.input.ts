import { Field, InputType } from "@nestjs/graphql";
import { IsString } from "class-validator";

@InputType()
export class CreateUserInput {
  @IsString()
  @Field(() => String, { description: 'Name of user' })
  name: string;

  @IsString()
  @Field(() => String, { description: 'Avatar of user', nullable: true })
  avatar?: string;
}
