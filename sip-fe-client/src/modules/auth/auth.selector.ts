import { AppState } from '../app.types';
import { AuthType } from './auth.reducer';

export const selectAuthState = (state: AppState): AuthType => state.auth.authState;