import { Resolver, Query, Mutation, Args, Int, PickType, ResolveField } from "@nestjs/graphql";
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserType } from "@modules/users/types/user.type";
import { TestType } from "@modules/users/types/test.type";
import { SearchCriteria } from "@modules/search-criteria/search-criteria";

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserType)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [UserType], { name: 'users' })
  findAll(@Args() searchCriteria: SearchCriteria) {
    console.log(searchCriteria);
    return this.usersService.findAll();
  }

  @Query(() => UserType, { name: 'user', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @ResolveField('dummy', () => TestType)
  getDummy(): TestType {
    return {
      id: '1',
      title: 'asd'
    }
  }

  @Mutation(() => UserType)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => UserType)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
