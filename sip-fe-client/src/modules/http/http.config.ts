import axios from 'axios';
import { AuthConfig, AuthConfigKeys } from '../auth/config/auth.config';

export interface InitialHttpConfig {
    baseUrl: string;
}

export function configHttp(config: InitialHttpConfig) {
    axios.defaults.baseURL = config.baseUrl;
    axios.defaults.headers.common['Authorization'] = window.localStorage.getItem(AuthConfig.get(AuthConfigKeys.AUTH_KEY_KEY)) || '';
    axios.defaults.headers.post['Content-Type'] = 'application/json';
}