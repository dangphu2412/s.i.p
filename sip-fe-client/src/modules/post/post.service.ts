import axios from 'axios';
import { createRequest } from '../http/http-request';
import { Query } from '../query/interface';
import { PostOverview } from './api/post.api';

export function getPostsOverview(query: Query) {
    const searchParams = new URLSearchParams();
    searchParams.append('filter', 'type|eq|Latest');
    return createRequest<PostOverview, Query>(axios.get('/v1/posts', {
        params: searchParams
    }));
}