import { createAction } from '@reduxjs/toolkit';
import { DataHolder } from './api/activity';

export type SaveDataHolderPayload = DataHolder; 

export const loadData = createAction('DATA/LOADING');
export const saveData = createAction<SaveDataHolderPayload>('DATA/SAVE');
export const setData = createAction('DATA/SET');
