import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { call, put, takeLatest } from 'redux-saga/effects';
import { saveData } from '../data/data.action';
import { Query } from '../query/interface';
import { fetchPosts } from './post.action';
import { getPostsOverview } from './post.service';

export function* getPostSaga() {
    yield takeLatest(
        fetchPosts.type,
        handleFetchPosts
    );
}

function* handleFetchPosts(action: PayloadAction<Query>): any {
    const query: Query = action.payload;
    const request = getPostsOverview(query);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        query,
        view: 'POST'
    }));
}
