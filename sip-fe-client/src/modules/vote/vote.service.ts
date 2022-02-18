import { RequestProcessor } from './../http/http-request';
import axios from 'axios';
import { createRequest } from '../http/http-request';

export function updateVoteForPost(postId: string): RequestProcessor<void> {
    return createRequest(axios.put(`/v1/posts/${postId}/votes`));
}

export function updateVoteForDiscussion(discussionId: string): RequestProcessor<void> {
    return createRequest(axios.put(`/v1/discussions/${discussionId}/votes`));
}

