import { call } from 'redux-saga/effects';
import { HttpServer } from '../http/api.service';
import { LoginPayload } from './auth.action';

export function* doLogin(loginDto: LoginPayload): Generator {
    return yield call(HttpServer.getServer().post, '/v1/auth/login', loginDto);
}