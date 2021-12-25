import { PermissionService } from '@modules/permission/permission.service';
import { User } from '@modules/user/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { LoginDto } from '../dto/login.dto';
import { LoginSuccessResponse } from '../interface';
import { GoogleUserExtractedDto } from '../types/google-user-extracted';
import { BcryptService } from './bcrypt.service';

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
    let user = await this.userService.findByEmail(createUserDto.email);

    if (!user) {
      await this.userService.createByGooglePayload(createUserDto);
      user = await this.userService.findByEmail(createUserDto.email);
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
