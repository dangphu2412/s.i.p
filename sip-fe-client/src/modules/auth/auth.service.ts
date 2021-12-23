import { call } from 'redux-saga/effects';
import { ApiRequest } from '../http/api-request';

export function doGoogleLogin() {
    return call(ApiRequest.get, '/v1/auth/login/google');
}
