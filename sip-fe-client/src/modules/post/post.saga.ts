import { PostStatus } from './constants/post-status.enum';
import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { SagaIterator } from 'redux-saga';
import { call, ForkEffect, put, takeLatest } from 'redux-saga/effects';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { MessageType } from '../app.types';
import { saveData } from '../data/data.action';
import { Query } from '../query/interface';
import { fireMessage } from '../message/message.action';
import { PatchPostDetail, UpdatePostDto } from './api/post.api';
import { PostActions, PostDetailRequest } from './post.action';
import { deleteDraftPost, followIdeaById, getIdeas, getPatchPostData, getPostDetail, getPostsOverview, getSelfIdeas, updatePostData } from './post.service';

export function* PostSagaTree(): Generator<ForkEffect<never>, void, unknown> {
    yield takeLatest(
        PostActions.getOverviewData.type,
        handleFetchPosts
    );
    yield takeLatest(
        PostActions.getIdeas.type,
        handleFetchIdeas
    );

    yield takeLatest(
        PostActions.getDetailData.type,
        handleFetchPostDetail
    );

    yield takeLatest(
        PostActions.getAuthorIdeas.type,
        handleFetchAuthorIdeas
    );

    yield takeLatest(
        PostActions.getPatchData.type,
        handleFetchPatchPostData
    );

    yield takeLatest(
        PostActions.saveData.type,
        handleSavePostData
    );

    yield takeLatest(
        PostActions.deleteDraft.type,
        handleDeletePostDraft
    );

    yield takeLatest(
        PostActions.followIdeaById.type,
        handleFollowIdeaById
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

function* handleFetchIdeas(action: PayloadAction<Query>): SagaIterator {
    const request = getIdeas({
        page: action.payload.page,
        filters: [],
        sorts: []
    });
    const data = yield call(request.handle);
    yield put(saveData({
        data: data.data,
        query: {},
        view: VIEW_SELECTOR.FIND_IDEA_OVERVIEW
    }));
}

function* handleFetchAuthorIdeas(action: PayloadAction<Query & { hashTag: string }>): SagaIterator {
    const request = getSelfIdeas(action.payload.hashTag, {
        page: action.payload.page,
        filters: action.payload.filters,
        sorts: []
    });
    const data = yield call(request.handle);
    yield put(saveData({
        data: data.data,
        query: {},
        view: VIEW_SELECTOR.FIND_POST_AUTHOR_IDEAS
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
        yield put(fireMessage({
            message: request.getErrorMessage(),
            type: MessageType.ERROR
        }));
    }
    if (action.payload.status === PostStatus.PUBLISH) {
        yield put(fireMessage({
            message: 'Post updated successfully',
            type: MessageType.SUCCESS
        }));
    }
    return;
}

function* handleDeletePostDraft(action: PayloadAction<string>): SagaIterator {
    const request = deleteDraftPost(action.payload);
    yield call(request.handle);
}

function* handleFollowIdeaById(action: PayloadAction<string>): SagaIterator {
    const request = followIdeaById(action.payload);
    yield call(request.handle);
}
