import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { saveData } from '../data/data.action';
import { Query } from '../query/interface';
import { TopicActions } from './topic.action';
import { searchTopics } from './topic.service';

export function* TopicSagaTree() {
    yield takeLatest(
        TopicActions.findMany,
        handleSearchTopics
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
