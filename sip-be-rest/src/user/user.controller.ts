import { UserCredential } from '@auth/client/user-cred';
import { PermissionGranted } from '@auth/decorator/granted-permission.decorator';
import { Protected } from '@auth/decorator/protected.decorator';
import { AuthContext } from '@auth/decorator/user-cred.decorator';
import { AccessRights } from '@constants/access-rights.enum';
import { toPage } from '@external/crud/extensions/typeorm-pageable';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { SearchQuery } from '@external/crud/search/decorator/search.decorator';
import { RuleManager } from '@external/racl/core/rule.manager';
import { ExtractRuleManager } from '@external/racl/decorator/get-manager.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { GrantPermissionDto } from './dto/grant-permission.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FetchUsersOverviewValidator } from './pipes/overview-search.validator';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PermissionGranted(AccessRights.RootAccess.ADMIN)
  @Protected
  @Get()
  public async findMany(
    @AuthContext() user: UserCredential,
    @ExtractRuleManager() ruleManager: RuleManager,
    @SearchQuery(FetchUsersOverviewValidator) searchQuery: SearchCriteria,
  ) {
    return toPage(await this.userService.findMany(searchQuery), searchQuery);
  }

  @Protected
  @Get('/makers')
  public findMakers(@SearchQuery() searchQuery: SearchCriteria) {
    return this.userService.findMakers(searchQuery);
  }

  @Post()
  public createOne(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
  }

  @Protected
  @Patch('/profile')
  public updateProfile(
    @Body() profile: UpdateProfileDto,
    @AuthContext() authContext: UserCredential,
  ) {
    return this.userService.updateProfile(+authContext.userId, profile);
  }

  @Post('/:userId/permissions')
  public grantPermissionsForUser(
    @Param('userId') userId: string,
    @Body() grantPermissionDto: GrantPermissionDto,
  ) {
    return this.userService.grantPermissionForUser(userId, grantPermissionDto);
  }

  @Protected
  @Get('me')
  public async getMe(@AuthContext() authContext: UserCredential) {
    const user = await this.userService.findById(+authContext.userId);
    if (!user) {
      throw new UnauthorizedException('User is not available now');
    }
    return user;
  }
}
