import { User } from '@user/user.entity';

export interface DiscussionSummary {
  id: string;
  title: string;
  content: string;
  author: User;
  totalReplies: number;
  totalVotes: number;
  isVoted?: boolean;
  createdAt: Date;
}
export type DiscussionOverview = DiscussionSummary[];
