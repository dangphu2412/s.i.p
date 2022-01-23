import axios from 'axios';
import { createRequest } from '../http/http-request';

export function updateVoteForPost(postId: string) {
    return createRequest(axios.put(`/v1/posts/${postId}/votes`));
}