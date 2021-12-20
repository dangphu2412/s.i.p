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

export const loggedInAction = createAction<AuthResponse>('AUTH/LOGGED_IN');