import axios from 'axios';
import { call, put } from 'redux-saga/effects';
import { fireError } from '../error/error.action';
import { setLoading } from '../loading/loading.action';

export interface InitialHttpConfig {
    baseUrl: string;
    authKey: string;
}

export class HttpServer {
    private static server: HttpServer;

    public static config(config: InitialHttpConfig) {
        axios.defaults.baseURL = config.baseUrl;
        axios.defaults.headers.common['Authorization'] = window.localStorage.getItem(config.authKey) ?? '';
        axios.defaults.headers.post['Content-Type'] = 'application/json';
    }

    public static getServer() {
        if (!HttpServer.server) {
            HttpServer.server = new HttpServer();
        }
        return HttpServer.server;
    }

    public *post(url: string, data: unknown): Generator {
        yield put(setLoading({ isLoading: true }));

        const response: any = yield call(HttpServer.getServer().doPost, url, data);
        
        yield put(setLoading({ isLoading: false }));
        
        if (response instanceof Error) {
            yield put(fireError({message: 'Got error'}));
            return;
        }
        
        return response;
    }

    private async doPost(url: string, data: unknown) {
        try {
            const response = await axios.post(url, JSON.stringify(data));
            return response;
        } catch (error) {
            return error;
        }
    }
}