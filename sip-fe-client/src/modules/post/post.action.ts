import { Query } from './../query/interface';
import { createAction } from '@reduxjs/toolkit';
import { CreatePostType } from './constants/create-type';

export interface PostDetailRequest {
    postId: string;
}

export interface InitPost {
    postType: CreatePostType;
    name?: string;
    productLink?: string;
}

export interface PatchPostDetail {
    name: string;
    tagLine: string;
    summary: string;
    links: {
        product?: string;
        facebook?: string;
    },
    topics: any[],
    thumbnail: string;
    gallery: {
        video?: string;
        images: string;
    },
    isHunter: boolean;
    sipers: any[];
    pricingType: string;
    content: string;
    launchSchedule: Date;
}

export const fetchPosts = createAction<Partial<Query>>('POST/FETCH');
export const fetchPostDetail = createAction<PostDetailRequest>('POST/FETCH_DETAIL');