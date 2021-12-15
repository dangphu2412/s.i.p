import { call } from 'redux-saga/effects';
import { LoginPayload } from './auth.action';
import { HttpService } from '../http';

export function* doLogin(loginDto: LoginPayload): Generator {
    return yield call(HttpService.post, '/v1/auth/login', loginDto);
}