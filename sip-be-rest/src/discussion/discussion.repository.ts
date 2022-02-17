import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { EntityRepository, TreeRepository } from 'typeorm';
import { DiscussionOverview } from './client/discussion-overview';
import { Discussion } from './entities/discussion.entity';

@EntityRepository(Discussion)
export class DiscussionRepository extends TreeRepository<Discussion> {
  public async findLatest(
    searchCriteria: SearchCriteria,
  ): Promise<DiscussionOverview> {
    return this.createQueryBuilder('discussions')
      .loadRelationCountAndMap(
        'discussions.totalVotes',
        'discussions.votes',
        'votes',
        (qb) => qb.andWhere('votes.isVoted = true'),
      )
      .loadRelationCountAndMap(
        'discussions.totalReplies',
        'discussions.replies',
        'replies',
      )
      .limit(searchCriteria.limit)
      .offset(searchCriteria.offset)
      .getMany();
  }
}
