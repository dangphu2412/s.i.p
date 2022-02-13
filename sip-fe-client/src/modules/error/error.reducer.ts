import produce from 'immer';
import { AnyAction, Reducer } from 'redux';
import { AppError } from '../app.types';
import { cancelError, fireError } from './error.action';

const initialState: AppError = {
    hasError: false
};

export function createErrorReducer(): Reducer<AppError> {
    return (state = initialState, action: AnyAction) => produce(state, draft => {
        switch(action.type) {
        case fireError.type:
            draft = {
                hasError: true,
                message: action.payload.message
            };
            break;
        case cancelError.type:
            draft.hasError = false;
            break;
        }

        return draft;
    });
}
