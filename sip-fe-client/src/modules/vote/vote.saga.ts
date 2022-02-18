import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, takeLatest } from 'redux-saga/effects';
import { PostVoting, VoteActions } from './vote.action';
import { updateVoteForDiscussion, updateVoteForPost } from './vote.service';

export function* VoteSagaTree(): SagaIterator {
    yield takeLatest(
        VoteActions.voteForPost.type,
        handleVoteForPost
    );

    yield takeLatest(
        VoteActions.voteForDiscussion.type,
        handleVoteForDiscussion
    );
}

function* handleVoteForPost(action: PayloadAction<PostVoting>): SagaIterator {
    const request = updateVoteForPost(action.payload.postId);
    yield call(request.handle);
}

function* handleVoteForDiscussion(action: PayloadAction<string>): SagaIterator {
    const request = updateVoteForDiscussion(action.payload);
    yield call(request.handle);
}
