import { QueryState } from './query/interface';
import { AuthState } from './auth/auth.reducer';
import { LangState } from './translations/translation.reducer';
import { DataHolders } from './data/api/activity';

export type AppError = {
    message?: string;
    hasError: boolean;
}

export type AppLoading = {
    isLoading: boolean;
    content?: string;
}

export type AppState = {
    error: AppError,
    loading: AppLoading,
    language: LangState,
    auth: AuthState,
    query: QueryState;
    dataHolders: DataHolders;
}