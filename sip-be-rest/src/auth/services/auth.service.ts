import { User } from 'src/user/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { LoginDto } from '../dto/login.dto';
import { LoginSuccessResponse } from '../client/login-success';
import { GoogleUserExtractedDto } from '../internal/google-user-extracted';
import { BcryptService } from './bcrypt.service';
import { PermissionService } from '@permission/permission.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private userService: UserService,
    private permissionService: PermissionService,
  ) {}

  public async simpleLogin(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.username);
    if (
      !user ||
      !(await this.bcryptService.compare(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException(
        'Your username or password is not correct',
      );
    }

    return this.toLoginSuccessResponse(user);
  }

  public async loginWithGoogle(
    createUserDto: GoogleUserExtractedDto,
  ): Promise<LoginSuccessResponse> {
    let userWithPermissions = await this.userService.findByEmail(
      createUserDto.email,
    );

    if (!userWithPermissions) {
      await this.userService.createByGooglePayload(createUserDto);
      userWithPermissions = await this.userService.findByEmail(
        createUserDto.email,
      );
    }

    return this.toLoginSuccessResponse(userWithPermissions);
  }

  public generateTestToken() {
    return {
      accessToken: this.jwtService.sign({
        sub: '9',
        fullName: 'Fus',
        permissions: { ADMIN: 1 },
        hashTag: 'Fusdeptrai',
      } as JwtPayloadDto),
      profile: {},
    };
  }

  private toLoginSuccessResponse(user: User): LoginSuccessResponse {
    const permissions = this.permissionService.toPermissionRules(
      user.permissions,
    );

    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        fullName: user.fullName,
        permissions,
        hashTag: user.hashTag,
      } as JwtPayloadDto),
      profile: this.userService.extractProfile(user),
    };
  }
}
