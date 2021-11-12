import { ConfigService } from '@modules/config/config.service';

export const GRAPHQL_UI_PATH = '/graphql';
export const OAUTH_CLIENT_ID = ConfigService.get('CLIENT_ID');
