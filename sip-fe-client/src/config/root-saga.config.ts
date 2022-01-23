import { all, fork } from 'redux-saga/effects';
import { AuthSagaTree } from '../modules/auth/auth.saga';
import { SagaIterator } from 'redux-saga';
import { PostSagaTree } from '../modules/post/post.saga';
import { VoteSagaTree } from 'src/modules/vote/vote.saga';

export default function* rootSaga(): SagaIterator {
    yield all([
        fork(AuthSagaTree),
        fork(PostSagaTree),
        fork(VoteSagaTree)
    ]);
}