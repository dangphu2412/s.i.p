import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { SearchCriteria } from '@modules/search-criteria/search-criteria';
import { UserType } from '@modules/users/types/user.type';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [UserType], { name: 'users' })
  findAll(@Args() searchCriteria: SearchCriteria) {
    console.log(searchCriteria);
    return this.usersService.findAll();
  }

  @Query(() => UserType, { name: 'user', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }
}
