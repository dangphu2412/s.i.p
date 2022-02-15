import { QueryState } from './query/interface';
import { AuthState } from './auth/auth.reducer';
import { LangState } from './translations/translation.reducer';
import { DataHolders } from './data/api/activity';

export enum MessageType {
    ERROR = 'error',
    INFO = 'info',
    SUCCESS = 'success',
    NO_CONTENT = 'no-content',
}

export type AppMessage = {
    message?: string;
    type: MessageType;
}

export type AppLoading = {
    isLoading: boolean;
    content?: string;
}

export type AppState = {
    message: AppMessage,
    loading: AppLoading,
    language: LangState,
    auth: AuthState,
    query: QueryState;
    dataHolders: DataHolders;
}
