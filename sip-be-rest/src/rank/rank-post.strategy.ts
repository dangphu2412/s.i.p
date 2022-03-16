import { PostSummary } from '@post/client/post-overview.api';
import { RankStrategy } from './rank.strategy';

export class PostRankingStrategy implements RankStrategy<PostSummary> {
  getWeights(): Record<string, number> {
    return {
      totalVotes: 1,
      totalReplies: 0.5,
    };
  }
  compute(input: PostSummary[]): PostSummary[] {
    let sumTotalVotes = 0;
    let sumTotalReplies = 0;
    const rankPoints = {};
    const weightsMap = this.getWeights();

    for (const post of input) {
      sumTotalVotes += post.totalVotes;
      sumTotalReplies += post.totalReplies;
    }

    for (const post of input) {
      const point =
        (post.totalVotes / sumTotalVotes) * weightsMap['totalVotes'] +
        (post.totalReplies / sumTotalReplies) * weightsMap['totalReplies'];

      rankPoints[post.id] = point;
    }

    return input.sort((a, b) => rankPoints[b.id] - rankPoints[a.id]);
  }
}
