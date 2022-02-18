import { createAction } from '@reduxjs/toolkit';

export interface PostVoting {
    postId: string;
}

export const VoteActions = {
    voteForPost: createAction<PostVoting>('VOTE/TOGGLE_POST'),
    voteForDiscussion: createAction<string>('VOTE/TOGGLE_DISCUSSION')
};
