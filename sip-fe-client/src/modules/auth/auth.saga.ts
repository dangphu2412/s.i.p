import { all, put, takeLatest } from '@redux-saga/core/effects';
import { REACT_APP_API_URL } from '../../config/constant.config';
import { loggedOutAction, loggingAction, loggingOutAction, loginAction, loginSSOWithGoogleAction, logoutAction } from './auth.action';
import { AuthConfig, AuthConfigKeys } from './config/auth.config';

export function* getAuthSaga() {
    yield all([
        takeLatest(loginSSOWithGoogleAction.type, function* (action) {
            if (loginAction.match(action)) {
                yield put(loggingAction());
                const googleUrl = `${REACT_APP_API_URL}/auth/login`;
                window.open(googleUrl, '_blank', 'width=500,height=600');
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