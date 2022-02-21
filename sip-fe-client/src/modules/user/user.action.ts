import { createAction } from '@reduxjs/toolkit';
import { Profile } from '../auth/auth.service';
import { Query } from '../query/interface';

export const UserActions = {
    findMakers: createAction<Query>('USER/SEARCH'),
    findSiper: createAction<string>('USER/SIPER'),
    updateProfile: createAction<Profile>('USER/UPDATE_PROFILE'),
};
