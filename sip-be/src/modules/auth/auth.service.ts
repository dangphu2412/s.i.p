import { UsersService } from '@modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateGoogleAccessTokenThenGetAuthCredentials(
    accessToken: string,
  ): Promise<OAuth> {
    const user = await this.userService.findByEmail('someemail');

    if (!user) {
      throw new UnauthorizedException(`Your email is not valid`);
    }

    return {
      token: this.jwtService.sign({ id: user.id }),
    };
  }
}
