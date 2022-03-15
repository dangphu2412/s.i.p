import { PostSummary } from '@post/client/post-overview.api';
import { RankStrategy } from './rank.strategy';

export class PostRankingStrategy implements RankStrategy<PostSummary> {
  getProperties(): string[] {
    return ['totalVotes', 'totalReplies'];
  }
  compute(input: PostSummary[]): PostSummary[] {
    throw new Error('Method not implemented.');
  }
}
