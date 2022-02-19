import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { EntityRepository, Repository } from 'typeorm';
import { DiscussionOverview } from './client/discussion-overview';
import { Discussion } from './discussion.entity';

@EntityRepository(Discussion)
export class DiscussionRepository extends Repository<Discussion> {
  public async findLatest(
    searchCriteria: SearchCriteria,
  ): Promise<DiscussionOverview> {
    return this.createQueryBuilder('discussions')
      .leftJoinAndSelect('discussions.author', 'author')
      .loadRelationCountAndMap(
        'discussions.totalVotes',
        'discussions.votes',
        'votes',
        (qb) => qb.andWhere('votes.isVoted = true'),
      )
      .loadRelationCountAndMap(
        'discussions.totalReplies',
        'discussions.comments',
        'comments',
      )
      .limit(searchCriteria.limit)
      .offset(searchCriteria.offset)
      .getMany();
  }

  public findOneDetailBySlug(slug: string) {
    return this.createQueryBuilder('discussions')
      .leftJoinAndSelect('discussions.author', 'author')
      .loadRelationCountAndMap(
        'discussions.totalVotes',
        'discussions.votes',
        'votes',
        (qb) => qb.andWhere('votes.isVoted = true'),
      )
      .loadRelationCountAndMap(
        'discussions.totalReplies',
        'discussions.comments',
        'comments',
      )
      .where('discussions.slug = :slug', { slug })
      .getOne();
  }

  public findBySlug(slug: string) {
    return this.findOne({
      where: {
        slug,
      },
    });
  }
}
