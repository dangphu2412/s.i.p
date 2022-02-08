import { createAction } from '@reduxjs/toolkit';
import { AuthState } from './auth.reducer';

export const loginGoogleAction = createAction('AUTH/LOGIN_SSO_GOOGLE');
export const loggingAction = createAction<void>('AUTH/LOGGING_IN');
export const loggedInAction = createAction<Omit<AuthState, 'authState'>>('AUTH/LOGGED_IN');

export const logoutAction = createAction('AUTH/LOG_OUT');
export const loggingOutAction = createAction('AUTH/LOGGING_OUT');
export const loggedOutAction = createAction<undefined>('AUTH/LOGGED_OUT');

export const restoreAction = createAction<void>('AUTH/RESTORE');
export const restoreSuccessAction = createAction<void>('AUTH/RESTORE_SUCCESS');
export const restoreFailedAction = createAction<void>('AUTH/RESTORE_FAILED');
export const restoreFinishAction = createAction<void>('AUTH/RESTORE_FINISH');

export const openAuthPopupAction = createAction<void>('AUTH/OPEN_AUTH_POPUP');
export const closeAuthPopupAction = createAction<void>('AUTH/CLOSE_AUTH_POPUP');