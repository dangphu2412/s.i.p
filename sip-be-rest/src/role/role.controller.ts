import { Protected } from 'src/auth/decorator/protected.decorator';
import { AuthContext } from 'src/auth/decorator/user-cred.decorator';
import { UserCredential } from 'src/auth/client/user-cred';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreatePermissionDto } from './dto/create-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleService } from './role.service';

@ApiTags('roles')
@Controller('v1/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiCreatedResponse()
  @ApiUnprocessableEntityResponse()
  @Protected
  @Post()
  public createOne(
    @Body() createDtoRole: CreateRoleDto,
    @AuthContext() user: UserCredential,
  ) {
    return this.roleService.createOne(createDtoRole, user);
  }

  @ApiCreatedResponse()
  @ApiUnprocessableEntityResponse()
  @ApiBody({
    isArray: true,
    type: () => [CreatePermissionDto],
  })
  @Post('/:roleId/permissions')
  public createPermissionsOfRole(
    @Body() createPermissionDto: CreatePermissionDto[],
    @Param('roleId') roleId: string,
  ) {
    return this.roleService.createPermissionsOfRole(
      roleId,
      createPermissionDto,
    );
  }

  @ApiOkResponse()
  @Get()
  public findManyRolesIncludesPermissions() {
    return this.roleService.findManyIncludesPermissions();
  }
}
