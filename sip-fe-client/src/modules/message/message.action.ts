import { createAction } from '@reduxjs/toolkit';
import { AppMessage } from '../app.types';

export const fireMessage = createAction<AppMessage>('APP/FIRE_MESSAGE');
export const resetMessage = createAction('APP/RESET_MESSAGE');
