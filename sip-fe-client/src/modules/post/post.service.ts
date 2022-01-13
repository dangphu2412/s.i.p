import axios from 'axios';
import { createRequest } from '../http/http-request';
import { Query } from '../query/interface';
import { PostDetail, PostOverview } from './api/post.api';
import { PostDetailRequest } from './post.action';

export function getPostsOverview(query: Query) {
    const searchParams = new URLSearchParams();
    searchParams.append('filter', 'type|eq|Latest');
    return createRequest<PostOverview, Query>(axios.get('/v1/posts', {
        params: searchParams
    }));
}

export function getPostDetail(postId: string) {
    return createRequest<PostDetail, PostDetailRequest>(axios.get(`/v1/posts/${postId}`));
}