import { createAction } from '@reduxjs/toolkit';

export interface LoginPayload {
    username: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    profile: any;
}

export const loginAction = createAction<LoginPayload>('AUTH/LOGIN');
export const loginSSOWithGoogleAction = createAction<LoginPayload>('AUTH/LOGIN_SSO_GOOGLE');
export const loggingAction = createAction('AUTH/LOGGING_IN');
export const loggedInAction = createAction<AuthResponse>('AUTH/LOGGED_IN');

export const logoutAction = createAction('AUTH/LOG_OUT');
export const loggingOutAction = createAction('AUTH/LOGGING_OUT');
export const loggedOutAction = createAction<undefined>('AUTH/LOGGED_OUT');