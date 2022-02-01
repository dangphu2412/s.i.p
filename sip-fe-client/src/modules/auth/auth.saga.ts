import { SagaIterator } from 'redux-saga';
import { takeLatest, put, call } from 'redux-saga/effects';
import { loggedOutAction, loggingOutAction, logoutAction, restoreAction, loggedInAction, restoreSuccessAction, restoreFailedAction, restoreFinishAction } from './auth.action';
import { getMe } from './auth.service';
import { AuthConfig, AuthConfigKeys } from './config/auth.config';
import { AuthProps } from './pages/LoginSuccessPage';

export function* AuthSagaTree() {
    yield takeLatest(
        logoutAction.type,
        handleLogout
    );

    yield takeLatest(
        restoreAction.type,
        handleAuthRestore
    );
}

function* handleLogout(): SagaIterator {
    yield put(loggingOutAction());
    const authKey = AuthConfig.get(AuthConfigKeys.AUTH_KEY_KEY);
    const token = window.localStorage.getItem(authKey);
    if (token) {
        window.localStorage.removeItem(authKey);
    }
    yield put(loggedOutAction());
}


function* handleAuthRestore(): SagaIterator {
    const authPropsAsString = localStorage.getItem(AuthConfig.get(AuthConfigKeys.AUTH_STATE_KEY));
    const authProps: AuthProps = authPropsAsString ? JSON.parse(authPropsAsString): null;

    if (authProps) {
        const request = getMe();
        yield call(request.doRequest);

        if (request.getErrorMessage()) {
            yield put(logoutAction());
            yield put(restoreFailedAction());
        } else {
            yield put(loggedInAction({
                profile: authProps
            }));
            yield put(restoreSuccessAction());
        }
        yield put(restoreFinishAction());
        return;
    }

    yield put(restoreFailedAction());
    yield put(restoreFinishAction());
}
