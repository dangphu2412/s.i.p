import { produce } from 'immer';
import { AnyAction } from 'redux';
import { Query } from './interface';
import { queryChanged, queryClear } from './query.action';

const initialState: Query = {
    filter: [],
    page: undefined,
    search: undefined,
    sort: []
};

export function queryReducer(state = initialState, action: AnyAction) {
    return produce(state, draft => {
        switch(action.type) {
        case queryChanged.type:
            break;
        case queryClear.type:
            break;
        }
        return draft;
    });
}