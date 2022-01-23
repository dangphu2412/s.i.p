import { createAction } from '@reduxjs/toolkit';

export interface PostVoting {
    postId: string;
}

export const voteForPost = createAction<PostVoting>('VOTE/SAVE');
