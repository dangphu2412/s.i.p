import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2AuthenticationProvider } from '../provider/o-auth2-authentication.provider';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedResponseDto } from '../dto/authenticated-response.dto';
import { BcryptService } from './bcrypt.service';
import { UserService } from '../../user/user.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { PermissionService } from '@modules/permission/permission.service';
import { LoginDto } from '../dto/login.dto';
import { User } from '@modules/user/user.entity';
import { LoginSuccessResponse } from '../interface';

@Injectable()
export class AuthService {
  constructor(
    private oAuth2AuthenticationProvider: OAuth2AuthenticationProvider,
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
    accessToken: string,
  ): Promise<AuthenticatedResponseDto> {
    const tokenPayload =
      await this.oAuth2AuthenticationProvider.checkAndClaimsUserWithGoogleAccessToken(
        accessToken,
      );

    let user = await this.userService.findByEmail(tokenPayload.email);

    if (!user) {
      user = await this.userService.createByGooglePayload(tokenPayload);
    }

    return this.toLoginSuccessResponse(user);
  }

  public generateTestToken() {
    return {
      accessToken: this.jwtService.sign(
        JwtPayloadDto.create('1', 'fus', { ADMIN: 1 }),
      ),
      profile: {},
    };
  }

  private toLoginSuccessResponse(user: User): LoginSuccessResponse {
    const permissions = this.permissionService.toPermissionRules(
      user.permissions,
    );

    return {
      accessToken: this.jwtService.sign(
        JwtPayloadDto.create(user.id, user.fullName, permissions),
      ),
      profile: this.userService.getBasicProfile(user),
    };
  }
}
