import { combineReducers } from 'redux';
import { dataHoldersReducer } from 'src/modules/data/data.reducer';
import { queryReducer } from 'src/modules/query/query.reducer';
import { authReducer } from '../modules/auth/auth.reducer';
import { errorReducer } from '../modules/error/error.reducer';
import { loadingReducer } from '../modules/loading/loading.reducer';
import { languageProviderReducer } from '../modules/translations/translation.reducer';

export default function createReducer() {
    const rootReducer = combineReducers({
        error: errorReducer,
        loading: loadingReducer,
        language: languageProviderReducer,
        auth: authReducer,
        query: queryReducer,
        dataHolders: dataHoldersReducer
    });
  
    return rootReducer;
}