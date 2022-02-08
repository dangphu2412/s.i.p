import { createAction } from '@reduxjs/toolkit';
import { Query } from '../query/interface';

export interface FindSiperRequest {
    hashTag: string;
}

export const UserActions = {
    findMakers: createAction<Query>('USER/SEARCH'),
    findSiper: createAction<FindSiperRequest>('USER/SIPER'),
};