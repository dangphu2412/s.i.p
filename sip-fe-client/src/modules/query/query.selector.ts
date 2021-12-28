import { AppState } from './../app.types';
import { QueryState } from './interface';

export const selectQuery = (state: AppState): QueryState => state.query;