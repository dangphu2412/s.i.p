import { CurrentUser } from '@modules/auth/decorator/current-user.decorator';
import { JwtAuthGuard } from '@modules/auth/guards/jwt.guard';
import { UserType } from '@modules/users/entities/user.type';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { PaginatedUser } from './entities/paginated-user.type';
import { UsersService } from './users.service';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [PaginatedUser], { name: 'users' })
  findAll(@CurrentUser() user) {
    return this.usersService.findAll();
  }

  @Query(() => UserType, { name: 'user', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }
}
