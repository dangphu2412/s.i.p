import { AppMessage, AppState } from '../app.types';

export const selectMessage = (state: AppState): AppMessage => state.message;
