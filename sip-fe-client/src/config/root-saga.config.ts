import { all } from 'redux-saga/effects';
import { getAuthSaga } from '../modules/auth/auth.saga';


export default function* rootSaga() {
    yield all([
        getAuthSaga
    ]);
}