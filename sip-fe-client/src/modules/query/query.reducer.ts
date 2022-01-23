import { produce } from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';
import { AnyAction } from 'redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { Query } from './interface';
import { queryChanged, queryClear } from './query.action';

const initialState: Query = {
    filters: [],
    page: undefined,
    search: undefined,
    sorts: []
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
    const { filters, page, search, sorts } = action.payload;

    if (page) {
        draft.page = page;
    }

    if (Array.isArray(filters)) {
        draft.filters = filters;
    }

    
    if (Array.isArray(sorts)) {
        draft.sorts = sorts;
    }

    if (search) {
        draft.search = search;
    }
}
