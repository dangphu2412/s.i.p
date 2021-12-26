import { all, fork } from 'redux-saga/effects';
import { getAuthSaga } from '../modules/auth/auth.saga';
import { SagaIterator } from 'redux-saga';

export default function* rootSaga(): SagaIterator {
    yield all([
        fork(getAuthSaga)
    ]);
}