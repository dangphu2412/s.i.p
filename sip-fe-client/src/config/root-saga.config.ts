import { all, fork } from 'redux-saga/effects';
import { AuthSagaTree } from '../modules/auth/auth.saga';
import { SagaIterator } from 'redux-saga';
import { PostSagaTree } from '../modules/post/post.saga';
import { VoteSagaTree } from 'src/modules/vote/vote.saga';
import { TopicSagaTree } from 'src/modules/topic/topic.saga';
import { UserSagaTree } from 'src/modules/user/user.saga';
import { DiscussionSagaTree } from 'src/modules/discussion/discussion.saga';

export default function* rootSaga(): SagaIterator {
    yield all([
        fork(AuthSagaTree),
        fork(UserSagaTree),
        fork(PostSagaTree),
        fork(VoteSagaTree),
        fork(TopicSagaTree),
        fork(DiscussionSagaTree)
    ]);
}