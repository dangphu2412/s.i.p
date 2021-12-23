import { put } from '@redux-saga/core/effects';
import { fireError } from '../error/error.action';
import { SagaFactory } from '../redux-custom/saga/saga.factory';
import { loggedInAction, loggedOutAction, loggingAction, loggingOutAction, loginGoogleAction, logoutAction } from './auth.action';
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

function* login() {
    yield put(loggingAction());
    window.open('http://localhost:3000/login/success?accessToken=test&refreshToken=test', '_blank', 'width=500,height=600');
    const interval = setInterval(() => {
        if (!window) {
            clearInterval(interval);
        } 
    }, 5000);
    const profile = localStorage.getItem(AuthConfig.get(AuthConfigKeys.AUTH_STATE_KEY));
    if (!profile) {
        fireError({message: 'Can not intitial user'});
    }
    yield put(loggedInAction({
        profile: JSON.parse(profile as string)
    }));
}

function *logout() {
    yield put(loggingOutAction());
    const authKey = AuthConfig.get(AuthConfigKeys.AUTH_KEY_KEY);
    const token = window.localStorage.getItem(authKey);
    if (token) {
        window.localStorage.removeItem(authKey);
    }
    yield put(loggedOutAction());
}
