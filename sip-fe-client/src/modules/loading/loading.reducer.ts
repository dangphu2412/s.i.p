import produce from 'immer';
import { AnyAction, Reducer } from 'redux';
import { AppLoading } from '../app.types';
import { setLoading } from './loading.action';

const initialState: AppLoading = {
    isLoading: false,
    content: 'Loading ...'
};

export function loadingReducer(): Reducer<AppLoading> {
    return (state = initialState, action: AnyAction) => produce(state, draft => {
        switch(action.type) {
        case setLoading.type:
            draft = {
                isLoading: action.payload.isLoading,
                content: action.payload.content || 'Loading ...'
            };
            break;
        }

        return draft;
    });
}
