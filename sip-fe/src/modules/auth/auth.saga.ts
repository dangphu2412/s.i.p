import { all, takeLatest } from '@redux-saga/core/effects';

export function* getAuthSaga() {
	yield all([
		takeLatest('LOGIN', function*() { yield console.log('Hello wolrd');})
	]);
}