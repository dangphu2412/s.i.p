import { Query } from './../query/interface';
import { createAction } from '@reduxjs/toolkit';

export interface PostDetailRequest {
    postId: string;
}

export const fetchPosts = createAction<Query>('POST/FETCH');
export const fetchPostDetail = createAction<PostDetailRequest>('POST/FETCH_DETAIL');