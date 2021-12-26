import { AppError, AppState } from '../app.types';

export const selectError = (state: AppState): AppError => state.error;