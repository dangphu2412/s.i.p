import { FilterUtils } from '@external/crud/common/pipes/filter.pipe';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { User } from '@user/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { PostOverview } from './client/post-overview.api';
import { PostStatus, ProductRunningStatus } from './enums/post-status.enum';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  public findLatestPosts(searchCriteria: SearchCriteria) {
    const queryBuilder = this.createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.topics', 'topics')
      .loadRelationCountAndMap(
        'posts.totalVotes',
        'posts.votes',
        'votes',
        (qb) => qb.andWhere('votes.isVoted = true'),
      )
      .loadRelationCountAndMap(
        'posts.totalReplies',
        'posts.comments',
        'comments',
      )
      .where('posts.status = :status', { status: PostStatus.PUBLISH })
      .orderBy('posts.createdAt', 'DESC')
      .take(searchCriteria.limit)
      .skip(searchCriteria.offset);

    if (FilterUtils.has(searchCriteria.filters, 'topicName')) {
      const topicName = FilterUtils.get(searchCriteria.filters, 'topicName');
      queryBuilder.where(`topics.name = :topicName`, { topicName });
    }
    return <Promise<PostOverview>>queryBuilder.getMany();
  }

  public findHottestPosts(searchCriteria: SearchCriteria) {
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
            .where('posts.status = :status', { status: PostStatus.PUBLISH })
            .groupBy('posts.id')
            .limit(searchCriteria.limit)
            .offset(searchCriteria.offset)
            .orderBy('total_votes', 'DESC');
          return qb;
        },
        'post_ordered_by_votes',
        'post_ordered_by_votes.id = posts.id',
      )
      .leftJoinAndSelect('posts.topics', 'topics')
      .loadRelationCountAndMap(
        'posts.totalReplies',
        'posts.comments',
        'comments',
      )
      .orderBy('posts_total_votes', 'DESC');

    if (FilterUtils.has(searchCriteria.filters, 'topicName')) {
      const topicName = FilterUtils.get(searchCriteria.filters, 'topicName');
      queryBuilder.where(`topics.name = :topicName`, { topicName });
    }
    return <Promise<PostOverview>>queryBuilder.getMany();
  }

  public findIdeaPosts(searchCriteria: SearchCriteria) {
    return this.createQueryBuilder('posts')
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.topics', 'topics')
      .where('posts.running_status IN (:...runningStatus)', {
        runningStatus: [
          ProductRunningStatus.LOOKING_FOR_MEMBERS,
          ProductRunningStatus.IDEA,
        ],
      })
      .andWhere('posts.status = :status', { status: PostStatus.PUBLISH })
      .orderBy('posts.createdAt', 'DESC')
      .take(searchCriteria.limit)
      .skip(searchCriteria.offset)
      .getMany();
  }

  public findPostsOfAuthor(searchCriteria: SearchCriteria, author: User) {
    return this.createQueryBuilder('posts')
      .innerJoin(
        'users',
        'author',
        `author.id = posts.authorId AND posts.authorId = ${author.id}`,
      )
      .leftJoinAndSelect('posts.topics', 'topics')
      .loadRelationCountAndMap(
        'posts.totalVotes',
        'posts.votes',
        'votes',
        (qb) => qb.andWhere('votes.isVoted = true'),
      )
      .loadRelationCountAndMap(
        'posts.totalReplies',
        'posts.comments',
        'comments',
      )
      .limit(searchCriteria.limit)
      .offset(searchCriteria.offset)
      .getMany() as Promise<PostOverview>;
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

  public findBySlug(slug: string): Promise<Post> {
    return this.findOne({
      where: {
        slug,
      },
    });
  }

  public toggleFollow(idea: Post, user: User) {
    const isFollowed = user.followedIdeas.some(
      (followedIdea) => followedIdea.id === idea.id,
    );

    if (isFollowed) {
      return this.createQueryBuilder('posts')
        .relation(Post, 'followers')
        .of(idea)
        .remove(user);
    }
    return this.createQueryBuilder('posts')
      .relation(Post, 'followers')
      .of(idea)
      .add(user);
  }
}
