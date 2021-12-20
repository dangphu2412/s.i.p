import produce from 'immer';
import { AnyAction } from 'redux';
import { loggedInAction } from './auth.action';

export enum AuthType {
    LOGGED_IN = 'LOGGED_IN',
    LOGGED_OUT = 'LOGGED_OUT'
}

export interface AuthState {
    profile?: any,
    authState: AuthType
}

const intialState: AuthState = {
    authState: AuthType.LOGGED_OUT
};

export function authReducer(state = intialState, action: AnyAction) {
    return produce(state, draft => {
        switch(action.type) {
        case loggedInAction.type:
            draft = {
                authState: AuthType.LOGGED_IN,
            };
            break;
        }
        return draft;
    });
}