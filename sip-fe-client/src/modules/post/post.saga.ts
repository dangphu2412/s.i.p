import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { takeLatest } from 'redux-saga/effects';
import { Query } from '../query/interface';
import { fetchPosts } from './post.action';

export function* getPostSaga() {
    yield takeLatest(
        fetchPosts.type,
        handleFetchPosts
    );
}

function handleFetchPosts(action: PayloadAction<Query>) {
    return;
}
