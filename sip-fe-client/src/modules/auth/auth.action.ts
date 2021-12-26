import { createAction } from '@reduxjs/toolkit';
import { AuthState } from './auth.reducer';

export const loginGoogleAction = createAction('AUTH/LOGIN_SSO_GOOGLE');
export const loggingAction = createAction<void>('AUTH/LOGGING_IN');
export const loggedInAction = createAction<Omit<AuthState, 'authState'>>('AUTH/LOGGED_IN');

export const logoutAction = createAction('AUTH/LOG_OUT');
export const loggingOutAction = createAction('AUTH/LOGGING_OUT');
export const loggedOutAction = createAction<undefined>('AUTH/LOGGED_OUT');