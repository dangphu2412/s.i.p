import axios from 'axios';
import { REACT_APP_API_URL } from '../../config/constant.config';
import { createRequest } from '../http/http-request';
export interface Profile {
  id: string;
  username: string;
  avatar: string;
  fullName: string;
  headline: string;
}

export function getLoginUrl(): string {
    return `${REACT_APP_API_URL}/v1/auth/google`;
}

export function getMe() {
    return createRequest<Profile, Record<string, never>>(axios.get('/v1/users/me'));
}