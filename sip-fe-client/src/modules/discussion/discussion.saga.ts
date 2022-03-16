import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { MessageType } from '../app.types';
import { saveData } from '../data/data.action';
import { fireMessage } from '../message/message.action';
import { Query } from '../query/interface';
import { CreateDiscussionDto, UpdateDiscussionDto } from './api/discussion.api';
import { CreatCommentDto, CreatReplyDto as CreateReplyDto, DiscussionActions } from './discussion.action';
import { createComment, createDiscussion, createDiscussionComment, createDiscussionCommentReply, createReply, deleteDiscussion, getDiscussionComments, getDiscussionDetail, getDiscussions, getPostComments, updateDiscussion } from './discussion.service';

export function* DiscussionSagaTree(): SagaIterator {
    yield takeLatest(
        DiscussionActions.getPostComments.type,
        handleGetPostComments
    );

    yield takeLatest(
        DiscussionActions.createComment.type,
        handleCommentCreation
    );

    yield takeLatest(
        DiscussionActions.createReply.type,
        handleReplyCreation
    );

    yield takeLatest(
        DiscussionActions.createDiscussionCommentReply.type,
        handleDiscussionCommentReplyCreation
    );

    yield takeLatest(
        DiscussionActions.createDiscussion.type,
        handleDiscussionCreation
    );

    yield takeLatest(
        DiscussionActions.createDiscussionComment.type,
        handleDiscussionCommentCreation
    );

    yield takeLatest(
        DiscussionActions.updateDiscussion.type,
        handleUpdateDiscussion
    );

    yield takeLatest(
        DiscussionActions.getDiscussions.type,
        handleGetDiscussions
    );

    yield takeLatest(
        DiscussionActions.getDiscussionDetail.type,
        handleGetDiscussionDetail
    );

    yield takeLatest(
        DiscussionActions.getDiscussionComments.type,
        handleGetDiscussionComments
    );

    yield takeLatest(
        DiscussionActions.deleteDiscussion,
        handleDeleteDiscussion
    );

}

function* handleCommentCreation(action: PayloadAction<CreatCommentDto>): SagaIterator {
    const request = createComment(action.payload);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.CREATE_COMMENT
    }));
}

function* handleDiscussionCommentCreation(action: PayloadAction<CreatCommentDto>): SagaIterator {
    const request = createDiscussionComment(action.payload);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.CREATE_COMMENT
    }));
}

function* handleReplyCreation(action: PayloadAction<CreateReplyDto>): SagaIterator {
    const request = createReply(action.payload);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.CREATE_REPLY
    }));
}

function* handleDiscussionCommentReplyCreation(action: PayloadAction<CreateReplyDto>): SagaIterator {
    const request = createDiscussionCommentReply(action.payload);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.CREATE_REPLY
    }));
}

function* handleUpdateDiscussion(action: PayloadAction<UpdateDiscussionDto>): SagaIterator {
    const request = updateDiscussion(action.payload.id, action.payload);
    yield call(request.handle);

    if (request.isSuccess()) {
        yield put(fireMessage({
            type: MessageType.SUCCESS,
            message: 'Update discussion successfully'
        }));
    }

}

function* handleGetPostComments(action: PayloadAction<{ slug: string }>): SagaIterator {
    const request = getPostComments(action.payload.slug);
    const data = yield call(request.handle);
    yield put(saveData({
        data: data.data,
        view: VIEW_SELECTOR.FIND_POST_COMMENTS
    }));
}

function* handleDiscussionCreation(action: PayloadAction<CreateDiscussionDto>): SagaIterator {
    const request = createDiscussion(action.payload);
    yield call(request.handle);
    if (request.isSuccess()) {
        yield put(fireMessage({
            type: MessageType.SUCCESS,
            message: 'Discussion created successfully'
        }));
    }
}

function* handleGetDiscussions(action: PayloadAction<Query>): SagaIterator {
    const request = getDiscussions(action.payload);
    const data = yield call(request.handle);
    yield put(saveData({
        data: data.data,
        view: VIEW_SELECTOR.FIND_DISCUSSIONS
    }));
}

function* handleGetDiscussionDetail(action: PayloadAction<string>): SagaIterator {
    const request = getDiscussionDetail(action.payload);
    const data = yield call(request.handle);
    yield put(saveData({
        data: data,
        view: VIEW_SELECTOR.FIND_DISCUSSION_DETAIL
    }));
}

function* handleGetDiscussionComments(action: PayloadAction<Partial<Query> & { slug: string }>): SagaIterator {
    const request = getDiscussionComments(action.payload.slug);
    const data = yield call(request.handle);
    yield put(saveData({
        data: data.data,
        view: VIEW_SELECTOR.FIND_DISCUSSION_COMMENTS
    }));
}

function* handleDeleteDiscussion(action: PayloadAction<string>) {
    const request = deleteDiscussion(action.payload);
    yield call(request.handle);
    yield put(saveData({
        data: 'DELETE_SUCCESS',
        view: VIEW_SELECTOR.DISCUSSION_CHANGE
    }));
}
