import { NotificationActions } from './notification.action';
import { PayloadAction } from '@reduxjs/toolkit';
import { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { saveData } from '../data/data.action';
import { getNotifications, updateIsReadNotifications } from './notification.service';

export function* NotificationSagaTree(): SagaIterator {
    yield takeLatest(
        NotificationActions.getNotifications.type,
        handleFetchNotifications
    );

    yield takeLatest(
        NotificationActions.updateIsReadNotifications.type,
        handleUpdateIsRead
    );
}

function* handleFetchNotifications(): SagaIterator {
    const request = getNotifications();
    const data = yield call(request.handle);
    yield put(saveData({
        data,
        view: VIEW_SELECTOR.FIND_NOTIFICATION
    }));
}

function* handleUpdateIsRead(action: PayloadAction<string[]>): SagaIterator {
    const request = updateIsReadNotifications(action.payload);
    yield call(request.handle);
}
