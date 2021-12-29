import { produce } from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';
import { AnyAction } from 'redux';
import { PayloadAction } from '@reduxjs/toolkit';
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
            updateQuery(action as PayloadAction<Query>, draft);
            break;
        case queryClear.type:
            draft = initialState;
            break;
        }
        return draft;
    });
}

function updateQuery(action: PayloadAction<Query>, draft: WritableDraft<Query>): void {
    const { filter, page, search, sort } = action.payload;

    if (page) {
        draft.page = page;
    }

    if (Array.isArray(filter)) {
        draft.filter = filter;
    }

    
    if (Array.isArray(sort)) {
        draft.sort = sort;
    }

    if (search) {
        draft.search = search;
    }
}
