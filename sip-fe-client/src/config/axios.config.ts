import { configHttp } from '../modules/http/http.config';
import { REACT_APP_API_URL } from './constant.config';

export function configAxios(): void {
    if (!REACT_APP_API_URL) {
        throw new Error('Missing config base api url');
    }

    configHttp({
        baseUrl: REACT_APP_API_URL
    });
}