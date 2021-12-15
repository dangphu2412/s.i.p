import { AuthConfig } from '../modules/auth/config/auth.config';
import { configAxios } from './axios.config';

export function configApp() {
    AuthConfig.config({
        authKey: 'auth',
        redirectRoute: '/login'
    });

    configAxios();
}