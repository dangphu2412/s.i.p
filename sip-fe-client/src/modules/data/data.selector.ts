import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '../app.types';

const selectDataHolders = (state: AppState) => state.dataHolders;

export const selectDataHolderByView = (view: string) => createSelector(selectDataHolders, selector => {
    return selector[view] ? selector[view] : undefined;
});
