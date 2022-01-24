import axios from 'axios';
import { createRequest } from '../http/http-request';
import { Query } from '../query/interface';
import { parseToSearchParams } from '../query/search-parser';
import { PostDetail, PostOverview } from './api/post.api';
import { InitPost, PostDetailRequest } from './post.action';

export function getPostsOverview(query: Query) {
    return createRequest<PostOverview, Query>(axios.get('/v1/posts', {
        params: parseToSearchParams(query)
    }));
}

export function getPostDetail(postId: string) {
    return createRequest<PostDetail, PostDetailRequest>(axios.get(`/v1/posts/${postId}`));
}

export function saveInitialPost(data: InitPost) {
    return createRequest<Record<string, unknown>, InitPost>(axios.post('/v1/posts', data));
}