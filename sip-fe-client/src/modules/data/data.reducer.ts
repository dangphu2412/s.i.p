import { produce } from 'immer';
import { Action } from 'redux';
import { saveData } from './data.action';

export function dataHoldersReducer(state = {}, action: Action) {
    return produce(state, draft => {
        if (saveData.match(action)) {
            draft = {
                [action.payload.view]: {
                    data: action.payload.data,
                    query: action.payload.query
                }
            };
        }

        return draft;
    });
}
