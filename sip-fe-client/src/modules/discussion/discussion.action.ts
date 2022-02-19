import { CreateDiscussionDto } from './api/discussion.api';
import { createAction } from '@reduxjs/toolkit';
import { Query } from '../query/interface';

export interface CreatCommentDto {
    slug: string;
    content: string;
}

export interface CreatReplyDto extends CreatCommentDto {
    commentId: string;
}

export const DiscussionActions = {
    createComment: createAction<CreatCommentDto>('DISCUSSION/CREATE_COMMENT'),
    createDiscussionComment: createAction<CreatCommentDto>('DISCUSSION/CREATE_DISCUSSION_COMMENT'),
    createReply: createAction<CreatReplyDto>('DISCUSSION/CREATE_REPLY'),
    createDiscussionCommentReply: createAction<CreatReplyDto>('DISCUSSION/CREATE_DISCUSSION_REPLY'),
    createDiscussion: createAction<CreateDiscussionDto>('DISCUSSION/CREATE_DISCUSSION'),
    getPostComments: createAction<{ slug: string }>('DISCUSSION/GET_POST_COMMENTS'),
    getDiscussions: createAction<Partial<Query>>('DISCUSSION/GET_DISCUSSIONS'),
    getDiscussionDetail: createAction<string>('DISCUSSION/GET_DISCUSSION_DETAIL'),
    getDiscussionComments: createAction<Partial<Query> & { slug: string }>('DISCUSSION/GET_DISCUSSION_COMMENTS'),
};
