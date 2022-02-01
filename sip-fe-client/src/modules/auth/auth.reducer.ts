import produce from 'immer';
import { AnyAction } from 'redux';
import { loggedInAction, loggedOutAction, restoreFinishAction } from './auth.action';
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
}

const initialState: AuthState = {
    authState: AuthType.LOGGED_OUT,
    restoreStatus: false,
};

export function authReducer(state = initialState, action: AnyAction) {
    return produce(state, draft => {
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
        }
        
        return draft;
    });
}