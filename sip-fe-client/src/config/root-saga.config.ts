import { all, fork } from 'redux-saga/effects';
import { getAuthSaga } from '../modules/auth/auth.saga';
import { SagaIterator } from 'redux-saga';
import { getPostSaga } from '../modules/post/post.saga';

export default function* rootSaga(): SagaIterator {
    yield all([
        fork(getAuthSaga),
        fork(getPostSaga)
    ]);
}