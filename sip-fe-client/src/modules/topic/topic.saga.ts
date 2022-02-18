import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { SagaIterator } from 'redux-saga';
import { call, ForkEffect, put, takeLatest } from 'redux-saga/effects';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { saveData } from '../data/data.action';
import { Query } from '../query/interface';
import { Topic } from './api/topic.api';
import { TopicActions } from './topic.action';
import { followTopic, getTopicDetail, searchTopics } from './topic.service';

export function* TopicSagaTree(): Generator<ForkEffect<never>, void, unknown> {
    yield takeLatest(
        TopicActions.getMany,
        handleSearchTopics
    );

    yield takeLatest(
        TopicActions.followTopic,
        handleFollowTopic
    );

    yield takeLatest(
        TopicActions.getDetail,
        handleGetTopicDetail
    );
}

function* handleSearchTopics(action: PayloadAction<Query>): SagaIterator {
    const request = searchTopics(action.payload);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.SEARCH_TOPIC
    }));
}

function* handleFollowTopic(action: PayloadAction<string>): SagaIterator {
    const request = followTopic(action.payload);
    yield call(request.handle);
}

function* handleGetTopicDetail(action: PayloadAction<string>) {
    const request = getTopicDetail(action.payload);
    const data: Topic = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.FIND_TOPIC_DETAIL
    }));
}
