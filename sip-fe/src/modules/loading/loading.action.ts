import { createAction } from '@reduxjs/toolkit';
import { AppLoading } from '../app.types';

export const setLoading = createAction<AppLoading>('APP/LOADING_SET');