import { AuthConfig } from '../modules/auth/config/auth.config';
import { configAxios } from './axios.config';

export function configApp(): void {
    AuthConfig.config({
        authKey: 'auth',
        redirectRoute: '/login',
        defaultRoute: '/'
    });

    configAxios();
}