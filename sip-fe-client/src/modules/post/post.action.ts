import { Query } from './../query/interface';
import { createAction } from '@reduxjs/toolkit';
import { CreatePostType } from './constants/create-type';

export interface PostDetailRequest {
    slug: string;
}

export interface InitPost {
    postType: CreatePostType;
    title: string;
    productLink?: string;
}

export const PostActions = {
    getOverviewData: createAction<Partial<Query>>('POST/GET_OVERVIEW_DATA'),
    getDetailData: createAction<PostDetailRequest>('POST/GET_DETAIL_DATA'),
    getPatchData: createAction<PostDetailRequest>('POST/GET_PATCH_DaTA'),
};
