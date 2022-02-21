import { ConfigService } from '@external/config/config.service';
import { LoginSuccessResponse } from 'src/auth/client/login-success';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';

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

  public getYoutubeThumbnailUrl(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
}
