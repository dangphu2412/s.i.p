import { Topic } from '@modules/topic/topic.entity';
import { User } from 'src/user/user.entity';

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  isAuthor: boolean;
  totalVotes: number;
  topics: Topic[];
  author: User;
}

export type PostOverview = PostSummary[];
