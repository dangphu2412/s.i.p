import { combineReducers } from 'redux';
import { globalReducer } from '../modules/app/app.reducer';
import { languageProviderReducer } from '../modules/translations/translation.reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer() {
	const rootReducer = combineReducers({
		global: globalReducer,
		language: languageProviderReducer,
	});
  
	return rootReducer;
}