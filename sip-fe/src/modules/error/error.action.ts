import { createAction } from '@reduxjs/toolkit';
import { AppError } from '../app.types';

export const fireError = createAction<Pick<AppError, 'message'>>('APP/ERROR_FIRE');
export const cancelError = createAction('APP/ERROR_CANCEL');