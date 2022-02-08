import axios from 'axios';
import { Profile } from '../auth/auth.service';
import { createRequest } from '../http/http-request';
import { Query } from '../query/interface';
import { parseToSearchParams } from '../query/search-parser';
import { Author } from './api/user.api';

export function searchMakers(query: Query) {
    return createRequest<Author[], Record<string, unknown>>(axios.get('/v1/users/makers', {
        params: parseToSearchParams(query),
        headers: {}
    }));
}

export function findSiper(hashTag: string) {
    return createRequest<Author[], Record<string, unknown>>(axios.get(`/v1/users/sipers/${hashTag}`));
}

export function updateProfile(profile: Profile) {
    return createRequest<Author[], Record<string, unknown>>(axios.patch('/v1/users/profile', profile));
}