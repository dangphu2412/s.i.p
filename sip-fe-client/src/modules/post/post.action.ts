import { Query } from './../query/interface';
import { createAction } from '@reduxjs/toolkit';
import { CreatePostType } from './constants/create-type';

export interface PostDetailRequest {
    postId: string;
}

export interface InitPost {
    postType: CreatePostType;
    title: string;
    productLink?: string;
}

export const fetchPosts = createAction<Partial<Query>>('POST/FETCH');
export const fetchPostDetail = createAction<PostDetailRequest>('POST/FETCH_DETAIL');