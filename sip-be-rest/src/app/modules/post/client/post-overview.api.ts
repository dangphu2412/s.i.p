export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  isVoted: boolean;
  totalVotes: boolean;
  topics: string[];
}

export type PostOverview = PostSummary[];
