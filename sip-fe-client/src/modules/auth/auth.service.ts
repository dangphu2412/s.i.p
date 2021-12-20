import { call } from 'redux-saga/effects';
import { LoginPayload } from './auth.action';
import { HttpService } from '../http';

export function doLogin(loginDto: LoginPayload) {
    return call(HttpService.post, '/v1/auth/login', loginDto);
}