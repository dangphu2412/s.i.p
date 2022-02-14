import { createAction } from '@reduxjs/toolkit';
import { DataHolder } from './api/activity';

export type SaveDataHolderPayload = DataHolder;

export const saveData = createAction<SaveDataHolderPayload>('DATA/SAVE');
export const cleanData = createAction<string>('DATA/CLEAN_UP');
