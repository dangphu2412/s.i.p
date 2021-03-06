import axios from 'axios';
import { createRequest } from '../http/http-request';
import { Query } from '../query/interface';
import { parseToSearchParams } from '../query/search-parser';
import { RequestProcessor } from './../http/http-request';
import { CreateDiscussionDto, Discussion, DiscussionOverview } from './api/discussion.api';
import { CreatCommentDto, CreatReplyDto } from './discussion.action';

export function getPostComments(slug: string): RequestProcessor<Discussion[]> {
    return createRequest<Discussion[], void>(axios.get(`/v1/posts/${slug}/comments`));
}

export function getDiscussions(query: Query): RequestProcessor<DiscussionOverview> {
    return createRequest<DiscussionOverview, Query>(axios.get('/v1/discussions', {
        params: parseToSearchParams(query)
    }));
}

export function getDiscussionDetail(slug: string): RequestProcessor<Discussion> {
    return createRequest<Discussion, void>(axios.get(`/v1/discussions/${slug}`));
}

export function getDiscussionComments(slug: string): RequestProcessor<Discussion[]> {
    return createRequest<Discussion[], void>(axios.get(`/v1/discussions/${slug}/comments`));
}

export function createComment(createCommentDto: CreatCommentDto): RequestProcessor<unknown> {
    return createRequest<unknown, CreatCommentDto>(axios.post(`/v1/posts/${createCommentDto.slug}/comments`, createCommentDto));
}

export function createDiscussionComment(createCommentDto: CreatCommentDto): RequestProcessor<unknown> {
    return createRequest<unknown, CreatCommentDto>(axios.post(`/v1/discussions/${createCommentDto.slug}/comments`, createCommentDto));
}

export function createReply(createReplyDto: CreatReplyDto): RequestProcessor<unknown> {
    return createRequest<unknown, CreatReplyDto>(axios.post(`/v1/posts/${createReplyDto.slug}/comments/${createReplyDto.commentId}/replies`, createReplyDto));
}

export function createDiscussionCommentReply(createReplyDto: CreatReplyDto): RequestProcessor<unknown> {
    return createRequest<unknown, CreatReplyDto>(axios.post(`/v1/discussions/${createReplyDto.slug}/comments/${createReplyDto.commentId}/replies`, createReplyDto));
}

export function createDiscussion(createDiscussionDto: CreateDiscussionDto): RequestProcessor<unknown> {
    return createRequest<unknown, CreateDiscussionDto>(axios.post('/v1/discussions', createDiscussionDto));
}

export function updateDiscussion(id: string, updateDiscussionDto: CreateDiscussionDto): RequestProcessor<unknown> {
    return createRequest<unknown, CreateDiscussionDto>(axios.patch(`/v1/discussions/${id}`, updateDiscussionDto));
}

export function deleteDiscussion(id: string): RequestProcessor<unknown> {
    return createRequest<unknown, CreateDiscussionDto>(axios.delete(`/v1/discussions/${id}`));
}
