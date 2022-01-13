import { Topic } from '../../topic/api/topic.api';
import { Author } from '../../user/api/user.api';

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  isAuthor: boolean;
  totalVotes: number;
  topics: Topic[];
  author: Author;
}

export type PostOverview = PostSummary[];

export interface PostDetail {
  id: number;
}
