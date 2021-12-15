import { AppState } from '../app.types';

export const selectAuthState = (state: AppState) => state.auth;