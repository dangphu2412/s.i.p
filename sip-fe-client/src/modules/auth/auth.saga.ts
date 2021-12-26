import { put, takeLatest } from '@redux-saga/core/effects';
import { loggedOutAction, loggingOutAction, logoutAction } from './auth.action';
import { AuthConfig, AuthConfigKeys } from './config/auth.config';

export function* getAuthSaga() {
    yield takeLatest(
        logoutAction.type,
        handleLogout
    );
}

function *handleLogout() {
    yield put(loggingOutAction());
    const authKey = AuthConfig.get(AuthConfigKeys.AUTH_KEY_KEY);
    const token = window.localStorage.getItem(authKey);
    if (token) {
        window.localStorage.removeItem(authKey);
    }
    yield put(loggedOutAction());
}
