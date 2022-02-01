import { AppState } from '../app.types';
import { AuthType } from './auth.reducer';

export const selectAuthState = (state: AppState): AuthType => state.auth.authState;
export const selectIsLoggingIn = (state: AppState): boolean => state.auth.authState === AuthType.LOGGED_IN;

export const selectRestoreStatus = (state: AppState): boolean | undefined => state.auth.restoreStatus;
