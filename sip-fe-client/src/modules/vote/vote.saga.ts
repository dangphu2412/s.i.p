import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, takeLatest } from 'redux-saga/effects';
import { PostVoting, voteForPost } from './vote.action';
import { updateVoteForPost } from './vote.service';

export function* VoteSagaTree(): SagaIterator {
    yield takeLatest(
        voteForPost.type,
        handleVoteForPost
    );
}

function* handleVoteForPost(action: PayloadAction<PostVoting>): SagaIterator {
    const request = updateVoteForPost(action.payload.postId);
    yield call(request.handle);
    return;
}