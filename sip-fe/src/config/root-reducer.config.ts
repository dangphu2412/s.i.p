import { combineReducers } from 'redux';
import { errorReducer } from '../modules/error/error.reducer';
import { loadingReducer } from '../modules/loading/loading.reducer';
import { languageProviderReducer } from '../modules/translations/translation.reducer';

export default function createReducer() {
	const rootReducer = combineReducers({
		error: errorReducer,
		loading: loadingReducer,
		language: languageProviderReducer,
	});
  
	return rootReducer;
}