import { CreatCommentDto, CreatReplyDto } from './discussion.action';
import axios from 'axios';
import { createRequest } from '../http/http-request';
import { Discussion } from './api/discussion.api';

export function getPostComments(slug: string) {
    return createRequest<Discussion[], void>(axios.get(`/v1/posts/${slug}/comments`));
}

export function createComment(createCommentDto: CreatCommentDto) {
    return createRequest<unknown, CreatCommentDto>(axios.post(`/v1/posts/${createCommentDto.slug}/comments`, createCommentDto));
}

export function createReply(createReplyDto: CreatReplyDto) {
    return createRequest<unknown, CreatReplyDto>(axios.post(`/v1/posts/${createReplyDto.slug}/comments/${createReplyDto.commentId}/replies`, createReplyDto));
}