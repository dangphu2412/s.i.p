import { Comment } from 'antd';
import { Author } from 'src/modules/user/api/user.api';

export interface CrudExtension {
    canUpdate: boolean;
    canDelete: boolean;
    readonly: boolean;
}

export interface Comment {
    id: string;
    updatedAt: string;
    content: string;
    author: Author;
}

export interface Discussion extends Comment {
    replies: Reply[];
}

export interface Reply extends Comment {
    parent: Discussion;
}

export interface CreateDiscussionDto {
    content: string;
    title: string;
}

export interface UpdateDiscussionDto extends CreateDiscussionDto {
    id: string;
}

export interface DiscussionSummary {
    id: string;
    title: string;
    slug: string;
    author: Author;
    totalReplies: number;
    totalVotes: number;
    isVoted: boolean;
    createdAt: string;
}

export type DiscussionOverview = DiscussionSummary[];
export type DiscussionOverviewExtension = (DiscussionSummary & CrudExtension)[];

export interface DiscussionDetail extends DiscussionSummary {
    content: string;
}
