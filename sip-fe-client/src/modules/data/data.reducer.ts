import { produce } from 'immer';
import { Action, Reducer } from 'redux';
import { DataHolders } from './api/activity';
import { cleanData, saveData } from './data.action';

export function dataHoldersReducer(): Reducer<DataHolders> {
    return (state = {}, action: Action) => produce(state, draft => {
        if (saveData.match(action)) {
            draft[action.payload.view] = {
                view: action.payload.view,
                data: action.payload.data,
                query: action.payload.query
            };
        } else if (cleanData.match(action)) {
            delete draft[action.payload];
        }

        return draft;
    });
}
