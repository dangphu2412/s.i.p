import { all, takeLatest } from '@redux-saga/core/effects';
import { AxiosResponse } from 'axios';
import { loginAction } from './auth.action';
import { doLogin } from './auth.service';

export function* getAuthSaga() {
    yield all([
        takeLatest(loginAction.type, function*(action) {
            if (loginAction.match(action)) {
                const loginResponse: AxiosResponse = yield doLogin(action.payload);
                console.log(loginResponse);
            }
        })
    ]);
}