import { User } from '@user/user.entity';

export interface DiscussionSummary {
  id: string;
  title: string;
  author: User;
  totalReplies: number;
  totalVotes: number;
  isVoted?: boolean;
}
export type DiscussionOverview = DiscussionSummary[];
