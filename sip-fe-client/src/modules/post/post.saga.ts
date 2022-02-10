import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { saveData } from '../data/data.action';
import { Query } from '../query/interface';
import { fireError } from './../error/error.action';
import { PatchPostDetail, UpdatePostDto } from './api/post.api';
import { PostActions, PostDetailRequest } from './post.action';
import { getPatchPostData, getPostDetail, getPostsOverview, getSelfIdeas, updatePostData } from './post.service';

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
        PostActions.getSelfIdeas.type,
        handleFetchSelfIdeas
    );

    yield takeLatest(
        PostActions.getPatchData.type,
        handleFetchPatchPostData
    );

    yield takeLatest(
        PostActions.saveData.type,
        handleSavePostData
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
        view: VIEW_SELECTOR.FIND_POST_OVERVIEW
    }));
}

function* handleFetchSelfIdeas(action: PayloadAction<Query & { hashTag: string }>): SagaIterator {
    const request = getSelfIdeas(action.payload.hashTag, {
        page: action.payload.page,
        filters: action.payload.filters,
        sorts: []
    });
    const data = yield call(request.handle);
    yield put(saveData({
        data: data.data,
        query: {},
        view: VIEW_SELECTOR.FIND_POST_SELF_IDEAS
    }));
}

function* handleFetchPostDetail(action: PayloadAction<PostDetailRequest>): SagaIterator {
    const request = getPostDetail(action.payload.slug);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.FIND_POST_DETAIL
    }));
}

function* handleFetchPatchPostData(action: PayloadAction<PostDetailRequest>): SagaIterator {
    const request = getPatchPostData(action.payload.slug);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.FIND_POST_PATCH_DETAIL
    }));
}

function* handleSavePostData(action: PayloadAction<PatchPostDetail>): SagaIterator {
    function toUpdatePostDto(patchPostDetail: PatchPostDetail): UpdatePostDto {
        return {
            ...patchPostDetail,
            makerIds: patchPostDetail.makers.map(maker => maker.id),
            topicIds: patchPostDetail.topics.map(topic => topic.id),
            socialMedia: {
                videoLink: patchPostDetail.videoLink,
                facebookLink: patchPostDetail.facebookLink,
                thumbnail: patchPostDetail.thumbnail,
                socialPreviewImage: patchPostDetail.socialPreviewImage,
                galleryImages: patchPostDetail.galleryImages
            },
            links: {
                productLink: patchPostDetail.productLink || ''
            }
        };
    }

    const request = updatePostData(toUpdatePostDto(action.payload));
    yield call(request.doRequest);
    if (request.getErrorMessage()) {
        yield put(fireError({ message: request.getErrorMessage() }));
    }
    return;
}