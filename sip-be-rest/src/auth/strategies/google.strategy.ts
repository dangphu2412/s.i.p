import { ConfigService } from '@external/config/config.service';
import { UrlProvider } from '@modules/../../url/url.provider';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { AuthService } from '../services/auth.service';
import { GoogleUserExtractedDto } from '../internal/google-user-extracted';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService, urlProvider: UrlProvider) {
    super({
      clientID: ConfigService.get('OAUTH_CLIENT_ID'),
      clientSecret: ConfigService.get('OAUTH_CLIENT_SECRET'),
      callbackURL: urlProvider.getOAuthSuccessRedirect(),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    console.log(profile);

    const user: GoogleUserExtractedDto = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    };
    done(null, user);
  }
}
