import { call } from 'redux-saga/effects';
import { REACT_APP_API_URL } from '../../config/constant.config';
import { ApiRequest } from '../http/client-http.handler';
import { HttpServer } from '../http/http.server';
import { GoogleLoginPayload } from './auth.action';

export function doGoogleLogin() {
    return call(ApiRequest.get, '/v1/auth/login/google');
}

export function* doVerifyIdentity(identity: GoogleLoginPayload) {
    const verifyUrl = `${REACT_APP_API_URL}/auth/verify`;
    const response: Error = yield call(HttpServer.doPost, verifyUrl, {});
    if (!(response instanceof Error)) {
        // yield put(loggedInAction, { accessToken: identity.accessToken });
    }
}
