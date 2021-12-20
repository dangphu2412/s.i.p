import { all, put, takeLatest } from '@redux-saga/core/effects';
import { AxiosResponse } from 'axios';
import { loggedOutAction, loggingOutAction, loginAction, logoutAction } from './auth.action';
import { doLogin } from './auth.service';
import { AuthConfig, AuthConfigKeys } from './config/auth.config';

export function* getAuthSaga() {
    yield all([
        takeLatest(loginAction.type, function* (action) {
            if (loginAction.match(action)) {
                const loginResponse: AxiosResponse = yield doLogin(action.payload);
                console.log(loginResponse);
            }
        }),
        takeLatest(logoutAction.type, function* () {
            yield put(loggingOutAction());
            const authKey = AuthConfig.get(AuthConfigKeys.AUTH_KEY_KEY);
            const token = window.localStorage.getItem(authKey);
            if (token) {
                window.localStorage.removeItem(authKey);
            }
            yield put(loggedOutAction());
        })
    ]);
}