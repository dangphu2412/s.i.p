import { CurrentUser } from '@modules/auth/decorator/current-user.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { SearchCriteria } from '@modules/search-criteria/search-criteria';
import { UserType } from '@modules/users/graph-model/user.type';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [UserType], { name: 'users' })
  findAll(@Args() searchCriteria: SearchCriteria, @CurrentUser() user) {
    console.log(user);

    console.log(searchCriteria);
    return this.usersService.findAll();
  }

  @Query(() => UserType, { name: 'user', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }
}
