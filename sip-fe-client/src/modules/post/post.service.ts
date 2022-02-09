import axios from 'axios';
import { REACT_APP_API_URL } from 'src/config/constant.config';
import { createRequest } from '../http/http-request';
import { Query } from '../query/interface';
import { parseToSearchParams } from '../query/search-parser';
import { PostDetail, PostOverview, UpdatePostDto } from './api/post.api';
import { FetchDetailType } from './constants/get-type';
import { InitPost, PostDetailRequest } from './post.action';

export function getPostsOverview(query: Query) {
    return createRequest<PostOverview, Query>(axios.get('/v1/posts', {
        params: parseToSearchParams(query)
    }));
}

export function getSelfIdeas(query: Query) {
    return createRequest<PostOverview, Query>(axios.get('/v1/posts/me', {
        params: parseToSearchParams(query)
    }));
}

export function getPostDetail(slug: string) {
    return createRequest<PostDetail, PostDetailRequest>(axios.get(`/v1/posts/${slug}`, {
        params: parseToSearchParams({
            filters: [
                {
                    column: 'type',
                    comparator: 'eq',
                    value: FetchDetailType.DETAIL
                }
            ],
            sorts: [],
        })
    }));
}

export function getPatchPostData(slug: string) {
    return createRequest<PostDetail, PostDetailRequest>(axios.get(`/v1/posts/${slug}`, {
        params: parseToSearchParams({
            filters: [
                {
                    column: 'type',
                    comparator: 'eq',
                    value: FetchDetailType.EDIT
                }
            ],
            sorts: [],
        })
    }));
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

export function getUploadUrl() {
    return `${REACT_APP_API_URL}/v1/media/upload`;
}