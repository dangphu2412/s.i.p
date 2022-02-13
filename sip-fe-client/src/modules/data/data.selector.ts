import { AppState } from '../app.types';
import { DataHolder, DataHolders } from './api/activity';

const selectDataHolders = (state: AppState): DataHolders => state.dataHolders;

export const selectDataHolderByView = (view: string) => (state: AppState): DataHolder | undefined => {
    const dataHolders = selectDataHolders(state);
    return dataHolders[view];
};
