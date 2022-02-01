import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { saveData } from '../data/data.action';
import { Query } from '../query/interface';
import { UserActions } from './user.action';
import { searchMakers } from './user.service';

export function* UserSagaTree() {
    yield takeLatest(
        UserActions.findMakers,
        handleSearchMakers
    );
}

function* handleSearchMakers(action: PayloadAction<Query>): SagaIterator {
    const request = searchMakers(action.payload);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.SEARCH_MAKERS
    }));
}
