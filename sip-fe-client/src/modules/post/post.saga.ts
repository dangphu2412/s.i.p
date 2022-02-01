import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { saveData } from '../data/data.action';
import { Query } from '../query/interface';
import { PostActions, PostDetailRequest } from './post.action';
import { getPatchPostData, getPostDetail, getPostsOverview } from './post.service';

export function* PostSagaTree() {
    yield takeLatest(
        PostActions.getOverviewData.type,
        handleFetchPosts
    );

    yield takeLatest(
        PostActions.getDetailData.type,
        handleFetchPostDetail
    );

    yield takeLatest(
        PostActions.getPatchData.type,
        handleFetchPatchPostData
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
        data: data.data,
        query: {},
        view: VIEW_SELECTOR.POST_OVERVIEW
    }));
}

function* handleFetchPostDetail(action: PayloadAction<PostDetailRequest>): SagaIterator {
    const request = getPostDetail(action.payload.slug);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.POST_DETAIL
    }));
}

function* handleFetchPatchPostData(action: PayloadAction<PostDetailRequest>): SagaIterator {
    const request = getPatchPostData(action.payload.slug);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.POST_PATCH_DETAIL
    }));
}