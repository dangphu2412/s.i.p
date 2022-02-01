import { FilterUtils } from '@external/crud/common/pipes/filter.pipe';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { EntityRepository, Repository } from 'typeorm';
import { PostOverview } from './client/post-overview.api';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  public findLatestPosts(searchQuery: SearchCriteria) {
    console.log('Getting latest');
    const queryBuilder = this.createQueryBuilder('posts')
      .addSelect(`post_ordered_by_votes.total_votes as "posts_total_votes"`)
      .innerJoin(
        (qb) => {
          qb.select('posts.id as id, COUNT(votes.id) as total_votes')
            .from(Post, 'posts')
            .leftJoin(
              'votes',
              'votes',
              'votes.post_id = posts.id AND votes.is_voted = true',
            )
            .groupBy('posts.id')
            .orderBy('posts.created_at', 'DESC')
            .limit(searchQuery.limit)
            .offset(searchQuery.offset);
          return qb;
        },
        'post_ordered_by_votes',
        'post_ordered_by_votes.id = posts.id',
      )
      .leftJoinAndSelect('posts.topics', 'topics');

    if (FilterUtils.has(searchQuery.filters, 'topicName')) {
      const topicName = FilterUtils.get(searchQuery.filters, 'topicName');
      queryBuilder.where(`topics.name = :topicName`, { topicName });
    }
    return <Promise<PostOverview>>queryBuilder.getMany();
  }

  /**
   * Lay ra 20 records nhieu vote nhat bao gom tong so vote va xem user da vote cho bai do hay chua
   */
  public findHottestPosts(searchQuery: SearchCriteria) {
    const queryBuilder = this.createQueryBuilder('posts')
      .addSelect(`post_ordered_by_votes.total_votes as "posts_total_votes"`)
      .innerJoin(
        (qb) => {
          qb.select('posts.id as id, COUNT(votes.id) as total_votes')
            .from(Post, 'posts')
            .leftJoin(
              'votes',
              'votes',
              'votes.post_id = posts.id AND votes.is_voted = true',
            )
            .groupBy('posts.id')
            .limit(searchQuery.limit)
            .offset(searchQuery.offset)
            .orderBy('total_votes', 'DESC');
          return qb;
        },
        'post_ordered_by_votes',
        'post_ordered_by_votes.id = posts.id',
      )
      .leftJoinAndSelect('posts.topics', 'topics')
      .orderBy('posts_total_votes', 'DESC');

    if (FilterUtils.has(searchQuery.filters, 'topicName')) {
      const topicName = FilterUtils.get(searchQuery.filters, 'topicName');
      queryBuilder.where(`topics.name = :topicName`, { topicName });
    }
    return <Promise<PostOverview>>queryBuilder.getMany();
  }

  public async isTitleConflict(title: string): Promise<boolean> {
    return (
      (await this.count({
        where: {
          title,
        },
      })) !== 0
    );
  }
}
