import { all, takeLatest } from '@redux-saga/core/effects';
import { loginAction } from './auth.action';


export function* getAuthSaga() {
	yield all([
		takeLatest(loginAction.type, function*() { yield console.log('Hello wolrd');})
	]);
}