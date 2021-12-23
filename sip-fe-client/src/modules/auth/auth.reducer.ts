import produce from 'immer';
import { AnyAction } from 'redux';
import { loggedInAction, loggedOutAction } from './auth.action';
import { AuthProps } from './components/LoginSuccessPage';

export enum AuthType {
    LOGGED_IN = 'LOGGED_IN',
    LOGGED_OUT = 'LOGGED_OUT'
}

export interface AuthState {
    profile?: AuthProps,
    authState: AuthType,
}

const initialState: AuthState = {
    authState: AuthType.LOGGED_OUT
};

export function authReducer(state = initialState, action: AnyAction) {
    return produce(state, draft => {
        switch(action.type) {
        case loggedInAction.type:
            draft = {
                authState: AuthType.LOGGED_IN,
                profile: action.payload.profile,
            };
            break;
        case loggedOutAction.type:
            draft = { authState: AuthType.LOGGED_OUT };
            break;
        }
        
        return draft;
    });
}