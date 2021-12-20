import { combineReducers } from 'redux';
import { authReducer } from '../modules/auth/auth.reducer';
import { errorReducer } from '../modules/error/error.reducer';
import { loadingReducer } from '../modules/loading/loading.reducer';
import { languageProviderReducer } from '../modules/translations/translation.reducer';

export default function createReducer() {
    const rootReducer = combineReducers({
        error: errorReducer,
        loading: loadingReducer,
        language: languageProviderReducer,
        auth: authReducer
    });
  
    return rootReducer;
}