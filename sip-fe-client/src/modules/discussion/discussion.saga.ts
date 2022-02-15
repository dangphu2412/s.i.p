import { fireMessage } from '../message/message.action';
import { CreatCommentDto, CreatReplyDto as CreateReplyDto, DiscussionActions } from './discussion.action';
import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createComment, createDiscussion, createReply, getPostComments } from './discussion.service';
import { saveData } from '../data/data.action';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { CreateDiscussionDto } from './api/discussion.api';
import { MessageType } from '../app.types';

export function* DiscussionSagaTree(): SagaIterator {
    yield takeLatest(
        DiscussionActions.createComment.type,
        handleCommentCreation
    );

    yield takeLatest(
        DiscussionActions.createReply.type,
        handleReplyCreation
    );

    yield takeLatest(
        DiscussionActions.createDiscussion.type,
        handleDiscussionCreation
    );

    yield takeLatest(
        DiscussionActions.getPostComments.type,
        handleGetPostComments
    );
}

function* handleCommentCreation(action: PayloadAction<CreatCommentDto>): SagaIterator {
    const request = createComment(action.payload);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.CREATE_COMMENT
    }));
    return;
}

function* handleReplyCreation(action: PayloadAction<CreateReplyDto>): SagaIterator {
    const request = createReply(action.payload);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.CREATE_REPLY
    }));
    return;
}

function* handleGetPostComments(action: PayloadAction<{ slug: string }>): SagaIterator {
    const request = getPostComments(action.payload.slug);
    const data = yield call(request.handle);
    yield put(saveData({
        data: data.data,
        view: VIEW_SELECTOR.FIND_POST_COMMENTS
    }));
    return;
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
