import { CreateDiscussionDto } from './api/discussion.api';
import { createAction } from '@reduxjs/toolkit';

export interface CreatCommentDto {
    slug: string;
    content: string;
}

export interface CreatReplyDto extends CreatCommentDto {
    commentId: string;
}

export const DiscussionActions = {
    createComment: createAction<CreatCommentDto>('DISCUSSION/CREATE_COMMENT'),
    createReply: createAction<CreatReplyDto>('DISCUSSION/CREATE_REPLY'),
    createDiscussion: createAction<CreateDiscussionDto>('DISCUSSION/CREATE_DISCUSSION'),
    getPostComments: createAction<{ slug: string }>('DISCUSSION/GET_POST_COMMENTS'),
};
