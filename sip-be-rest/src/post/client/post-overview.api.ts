import { PostStatus } from '@post/enums/post-status.enum';
import { Topic } from 'src/topic/topic.entity';
import { User } from 'src/user/user.entity';

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  isVoted: boolean;
  totalVotes: number;
  topics: Topic[];
  author?: User;
  thumbnail: string;
  updatedAt: Date;
  status: PostStatus;
}

export type PostOverview = PostSummary[];
