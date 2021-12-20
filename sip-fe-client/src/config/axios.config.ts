import { HttpServer } from '../modules/http/http.server';
import { REACT_APP_API_URL } from './constant.config';

export function configAxios() {
    if (!REACT_APP_API_URL) {
        throw new Error('Missing config base api url');
    }

    HttpServer.config({
        baseUrl: REACT_APP_API_URL
    });
}