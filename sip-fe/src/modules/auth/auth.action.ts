import { createAction } from '@reduxjs/toolkit';

export interface LoginPayload {
    username: string;
    password: string;
}

export const loginAction = createAction<LoginPayload>('AUTH/LOGIN');
