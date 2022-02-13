import { combineReducers, Reducer } from 'redux';
import { dataHoldersReducer as createDataHoldersReducer } from 'src/modules/data/data.reducer';
import { queryReducer as createQueryReducer } from 'src/modules/query/query.reducer';
import { createAuthReducer } from '../modules/auth/auth.reducer';
import { createErrorReducer } from '../modules/error/error.reducer';
import { loadingReducer as createLoadingReducer } from '../modules/loading/loading.reducer';
import { languageProviderReducer as createLanguageProviderReducer } from '../modules/translations/translation.reducer';

export default function createReducer(): Reducer {
    const rootReducer = combineReducers({
        error: createErrorReducer(),
        loading: createLoadingReducer(),
        language: createLanguageProviderReducer(),
        auth: createAuthReducer(),
        query: createQueryReducer(),
        dataHolders: createDataHoldersReducer()
    });

    return rootReducer;
}
