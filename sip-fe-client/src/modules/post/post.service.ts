import axios from 'axios';
import { createRequest } from '../http/http-request';
import { Query } from '../query/interface';
import { parseToSearchParams } from '../query/search-parser';
import { PostDetail, PostOverview, UpdatePostDto } from './api/post.api';
import { InitPost, PostDetailRequest } from './post.action';

export function getPostsOverview(query: Query) {
    return createRequest<PostOverview, Query>(axios.get('/v1/posts', {
        params: parseToSearchParams(query)
    }));
}

export function getPostDetail(slug: string) {
    return createRequest<PostDetail, PostDetailRequest>(axios.get(`/v1/posts/${slug}`));
}

export function getPatchPostData(slug: string) {
    return createRequest<PostDetail, PostDetailRequest>(axios.get(`/v1/posts/${slug}`));
}

export function createInitialPost(data: InitPost) {
    return createRequest<Record<string, unknown>, InitPost>(axios.post('/v1/posts', data));
}

export function updatePostData(data: UpdatePostDto) {
    return createRequest<Record<string, unknown>, UpdatePostDto>(axios.patch(`/v1/posts/${data.id}`, data,
        {
            params: {
                status: data.status
            }
        }
    ));
}