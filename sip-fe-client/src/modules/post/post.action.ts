import { Query } from './../query/interface';
import { createAction } from '@reduxjs/toolkit';
import { CreatePostType } from './constants/create-type';
import { PatchPostDetail } from './api/post.api';

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
    getIdeas: createAction<Partial<Query>>('POST/GET_IDEA_DATA'),
    getAuthorIdeas: createAction<Partial<Query> & { hashTag: string }>('POST/GET_AUTHOR_IDEAS'),
    getDetailData: createAction<PostDetailRequest>('POST/GET_DETAIL_DATA'),
    getPatchData: createAction<PostDetailRequest>('POST/GET_PATCH_DaTA'),
    saveData: createAction<PatchPostDetail>('POST/SAVE_DATA'),
    deleteDraft: createAction<string>('POST/DELETE_DRAFT')
};
