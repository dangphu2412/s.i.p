import { all, put, takeLatest } from '@redux-saga/core/effects';
import { AxiosResponse } from 'axios';
import { loggedInAction, loggedOutAction, loggingAction, loggingOutAction, loginAction, logoutAction } from './auth.action';
import { doLogin } from './auth.service';
import { AuthConfig, AuthConfigKeys } from './config/auth.config';

export function* getAuthSaga() {
    yield all([
        takeLatest(loginAction.type, function* (action) {
            if (loginAction.match(action)) {
                yield put(loggingAction());
                const loginResponse: AxiosResponse = yield doLogin(action.payload);
                yield put(loggedInAction({
                    accessToken: loginResponse.data.accessToken,
                    profile: loginResponse.data.profile
                }));
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