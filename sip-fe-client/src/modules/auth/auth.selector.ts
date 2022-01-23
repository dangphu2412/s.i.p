import { AppState } from '../app.types';
import { AuthType } from './auth.reducer';

export const selectAuthState = (state: AppState): AuthType => state.auth.authState;
export const selecctIsLoggingIn = (state: AppState): boolean => state.auth.authState === AuthType.LOGGED_IN;