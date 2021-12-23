import { HttpServer } from './http.server';
import { call, put } from 'redux-saga/effects';
import { fireError } from '../error/error.action';
import { setLoading } from '../loading/loading.action';
import { AxiosError } from 'axios';

export class ApiRequest {
    public static *get(url: string, params?: unknown): Generator {
        yield put(setLoading({ isLoading: true }));

        const response: any = yield call(HttpServer.doGet, url, params);
        
        yield put(setLoading({ isLoading: false }));
        
        if (response instanceof Error) {
            console.log(response);
            yield put(fireError({message: (response as AxiosError).response?.data.message}));
            return;
        }
        
        return response;
    }
    
    public static *post(url: string, data: unknown, params?: unknown): Generator {
        yield put(setLoading({ isLoading: true }));

        const response: any = yield call(HttpServer.doPost, url, data, params);
        
        yield put(setLoading({ isLoading: false }));
        
        if (response instanceof Error) {
            console.log(response);
            yield put(fireError({message: (response as AxiosError).response?.data.message}));
            return;
        }
        
        return response;
    }
}