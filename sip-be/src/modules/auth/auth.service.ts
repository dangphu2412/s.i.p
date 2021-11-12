import { UsersService } from '@modules/users/users.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { OAUTH_CLIENT_ID } from 'src/constants/config.constant';
import { OAuth } from './entities/auth.entity';

@Injectable()
export class AuthService {
  private logger = new Logger();
  private oauth2Client: OAuth2Client;

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.oauth2Client = new OAuth2Client(OAUTH_CLIENT_ID);
  }

  /**
   * @throws {BadRequestException}
   */
  private async verifyGoogleAccessToken(accessToken: string) {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: accessToken,
        audience: OAUTH_CLIENT_ID,
      });
      return ticket.getPayload();
    } catch (error) {
      this.logger.error(error.message, AuthService.name);
      throw new BadRequestException('Access token is not valid');
    }
  }

  public async validateGoogleAccessTokenThenGetAuthCredentials(
    accessToken: string,
  ): Promise<OAuth> {
    const payload: TokenPayload = await this.verifyGoogleAccessToken(
      accessToken,
    );
    let user = await this.userService.findByEmail(payload.email);

    if (!user) {
      user = await this.userService.createWithGoogleTokenPayload(payload);
    }

    return {
      token: this.jwtService.sign({ id: user.id }),
    };
  }
}
