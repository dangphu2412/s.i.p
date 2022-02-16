import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { EntityRepository, TreeRepository } from 'typeorm';
import { DiscussionOverview } from './client/discussion-overview';
import { Discussion } from './entities/discussion.entity';

@EntityRepository(Discussion)
export class DiscussionRepository extends TreeRepository<Discussion> {
  public findLatest(
    searchCriteria: SearchCriteria,
  ): Promise<DiscussionOverview> {
    return this.createQueryBuilder('discussions')
      .loadRelationCountAndMap(
        'discussions.totalVotes',
        'discussions.votes',
        'votes',
      )
      .limit(searchCriteria.limit)
      .offset(searchCriteria.offset)
      .getMany();
  }
}
