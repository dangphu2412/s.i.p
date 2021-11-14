import { combineReducers } from 'redux';
import { errorReducer } from '../modules/error/error.reducer';
import { languageProviderReducer } from '../modules/translations/translation.reducer';

export default function createReducer() {
	const rootReducer = combineReducers({
		error: errorReducer,
		language: languageProviderReducer,
	});
  
	return rootReducer;
}