import produce from 'immer';
import { AnyAction, Reducer } from 'redux';
import { AppMessage, MessageType } from '../app.types';
import { resetMessage, fireMessage } from './message.action';

const initialState: AppMessage = {
    type: MessageType.NO_CONTENT
};

export function createMessageReducer(): Reducer<AppMessage> {
    return (state = initialState, action: AnyAction) => produce(state, draft => {
        switch(action.type) {
        case fireMessage.type:
            draft = {
                type: action.payload.type,
                message: action.payload.message
            };
            break;
        case resetMessage.type:
            draft.type = MessageType.NO_CONTENT;
            draft.message = '';
            break;
        }

        return draft;
    });
}
