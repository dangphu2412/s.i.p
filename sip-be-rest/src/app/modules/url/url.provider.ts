import { ConfigService } from '@external/config/config.service';
import { LoginSuccessResponse } from '@modules/auth/interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlProvider {
  public getOAuthSuccessRedirect() {
    return ConfigService.get('OAUTH_REDIRECT_URL');
  }

  public getClientSuccessRedirect(loginSuccessResponse: LoginSuccessResponse) {
    const url = new URL(ConfigService.get('OAUTH_CLIENT_REDIRECT'));
    url.searchParams.append('accessToken', loginSuccessResponse.accessToken);
    return url.toString();
  }
}
