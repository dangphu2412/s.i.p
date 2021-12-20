import produce from 'immer';
import { AnyAction } from 'redux';

const DEFAULT_LOCALE = 'vi';

export interface LangState {
    locale: string;
}

export const initialState = {
    locale: DEFAULT_LOCALE,
};
  
export const languageProviderReducer = (state = initialState, action: AnyAction) =>
    produce(state, draft => {
        switch (action.type) {
        case 'CHANGE_LOCALE':
            draft.locale = action.locale;
            break;
        }
        return draft;
    });