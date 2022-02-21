import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';
import { SagaIterator } from 'redux-saga';
import { call, ForkEffect, put, takeLatest } from 'redux-saga/effects';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { Profile } from '../auth/auth.service';
import { saveData } from '../data/data.action';
import { Query } from '../query/interface';
import { UserActions } from './user.action';
import { findSiper, searchMakers, updateProfile } from './user.service';

export function* UserSagaTree(): Generator<ForkEffect<never>, void, unknown> {
    yield takeLatest(
        UserActions.findMakers,
        handleSearchMakers
    );

    yield takeLatest(
        UserActions.findSiper,
        handleFindSiper
    );

    yield takeLatest(
        UserActions.updateProfile.type,
        handleUpdateProfile
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

function* handleFindSiper(action: PayloadAction<string>): SagaIterator {
    const request = findSiper(action.payload);
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.FIND_SIPER
    }));
}

function* handleUpdateProfile(action: PayloadAction<Profile>): SagaIterator {
    const request = updateProfile(action.payload);
    yield call(request.handle);
}
