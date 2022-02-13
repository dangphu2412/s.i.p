import produce from 'immer';
import { AnyAction, Reducer } from 'redux';
import { closeAuthPopupAction, loggedInAction, loggedOutAction, openAuthPopupAction, restoreFinishAction } from './auth.action';
import { AuthProps } from './pages/LoginSuccessPage';

export enum AuthType {
    LOGGED_IN = 'LOGGED_IN',
    LOGGED_OUT = 'LOGGED_OUT',
    RESTORE_FINISH = 'RESTORE_FINISH',
}

export interface AuthState {
    profile?: AuthProps,
    authState: AuthType,
    restoreStatus?: boolean;
    modalOpened?: boolean;
}

const initialState: AuthState = {
    authState: AuthType.LOGGED_OUT,
    restoreStatus: false,
    modalOpened: false,
};

export function createAuthReducer(): Reducer<AuthState> {
    return (state = initialState, action: AnyAction) => produce(state, draft => {
        switch(action.type) {
        case loggedInAction.type:
            draft = {
                ...state,
                authState: AuthType.LOGGED_IN,
                profile: action.payload.profile,
            };
            break;
        case loggedOutAction.type:
            draft = { ...state, authState: AuthType.LOGGED_OUT };
            break;
        case restoreFinishAction.type:
            draft = { ...state, restoreStatus: true };
            break;
        case openAuthPopupAction.type:
            draft = { ...state, modalOpened: true };
            break;
        case closeAuthPopupAction.type:
            draft = { ...state, modalOpened: false };
        }

        return draft;
    });
}
