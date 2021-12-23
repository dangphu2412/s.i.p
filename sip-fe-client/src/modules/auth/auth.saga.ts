import { put } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { SagaFactory } from '../redux-custom/saga/saga.factory';
import { loggedOutAction, loggingAction, loggingOutAction, loginGoogleAction, logoutAction } from './auth.action';
import { AuthConfig, AuthConfigKeys } from './config/auth.config';

export function getAuthSaga() {
    return new SagaFactory()
        .takeLatest({
            pattern: loginGoogleAction.type,
            consumer: login
        })
        .takeLatest({
            pattern: logoutAction.type,
            consumer: logout
        })
        .collect();
}

function* login(action: AnyAction) {
    yield put(loggingAction());
}

function *logout(action: AnyAction) {
    yield put(loggingOutAction());
    const authKey = AuthConfig.get(AuthConfigKeys.AUTH_KEY_KEY);
    const token = window.localStorage.getItem(authKey);
    if (token) {
        window.localStorage.removeItem(authKey);
    }
    yield put(loggedOutAction());
}