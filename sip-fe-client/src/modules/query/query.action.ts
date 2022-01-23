import { createAction } from '@reduxjs/toolkit';
import { Query } from './interface';

export const queryChanged = createAction<Partial<Query>>('QUERY/CHANGED');
export const queryClear = createAction('QUERY/CLEAR');