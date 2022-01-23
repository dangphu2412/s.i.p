import { PayloadAction } from '@reduxjs/toolkit';
import { call, takeLatest } from 'redux-saga/effects';
import { PostVoting, voteForPost } from './vote.action';
import { updateVoteForPost } from './vote.service';

export function* VoteSagaTree() {
    yield takeLatest(
        voteForPost.type,
        handleVoteForPost
    );
}

function* handleVoteForPost(action: PayloadAction<PostVoting>) {
    const request = updateVoteForPost(action.payload.postId);
    yield call(request.handle);
    return;
}