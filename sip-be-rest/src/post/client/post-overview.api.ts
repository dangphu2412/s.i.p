import { PostStatus, ProductRunningStatus } from '@post/enums/post-status.enum';
import { Topic } from 'src/topic/topic.entity';
import { User } from 'src/user/user.entity';

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  isVoted: boolean;
  totalVotes: number;
  totalReplies: number;
  topics: Topic[];
  author?: User;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
  status: PostStatus;
  runningStatus: ProductRunningStatus;
}

export type PostOverview = PostSummary[];
