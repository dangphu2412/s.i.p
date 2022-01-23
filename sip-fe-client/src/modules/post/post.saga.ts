import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { saveData } from '../data/data.action';
import { Query } from '../query/interface';
import { fetchPostDetail, fetchPosts, PostDetailRequest } from './post.action';
import { getPostDetail, getPostsOverview } from './post.service';

export function* PostSagaTree() {
    yield takeLatest(
        fetchPosts.type,
        handleFetchPosts
    );

    yield takeLatest(
        fetchPostDetail.type,
        handleFetchPostDetail
    );
}

function* handleFetchPosts(action: PayloadAction<Query>): SagaIterator {
    const request = getPostsOverview({
        page: action.payload.page,
        filters: action.payload.filters,
        sorts: []
    });
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        query: {},
        view: 'POST'
    }));
}

function* handleFetchPostDetail(action: PayloadAction<PostDetailRequest>): SagaIterator {
    const request = getPostDetail(action.payload.postId);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: 'POST_DETAIL'
    }));
}
