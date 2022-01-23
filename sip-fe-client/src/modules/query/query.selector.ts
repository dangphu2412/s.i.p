import { createSelector } from '@reduxjs/toolkit';
import { AppState } from './../app.types';
import { QueryState } from './interface';

export const selectQuery = (state: AppState): QueryState => state.query;

export const selectSearch = createSelector(selectQuery, state => state.search);
export const selectSort = createSelector(selectQuery, state => state.sorts);
export const selectFilter = createSelector(selectQuery, state => state.filters);
export const selectPage = createSelector(selectQuery, state => state.page);