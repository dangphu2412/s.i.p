import { createAction } from '@reduxjs/toolkit';
import { Query } from '../query/interface';

export const UserActions = {
    findMakers: createAction<Query>('USER/SEARCH'),
};