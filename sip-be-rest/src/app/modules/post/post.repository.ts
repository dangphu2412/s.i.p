import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { UserCredential } from '@modules/auth/types/user-cred.interface';
import { EntityRepository, Repository } from 'typeorm';
import { PostOverview } from './client/post-overview.api';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  public findLatestPosts(
    searchQuery: SearchCriteria,
    author: UserCredential | undefined,
  ) {
    const queryBuilder = this.createQueryBuilder('posts')
      .addSelect(
        `post_ordered_by_votes.total_votes as "posts_total_votes"
        , ${this.getSelectIsAuthorQuery(author)}`,
      )
      .innerJoin(
        (qb) => {
          qb.select('posts.id as id, COUNT(votes.id) as total_votes')
            .from(Post, 'posts')
            .leftJoin('votes', 'votes', 'votes.post_id = posts.id')
            .groupBy('posts.id')
            .orderBy('total_votes', 'DESC')
            .limit(searchQuery.limit)
            .offset(searchQuery.offset);
          return qb;
        },
        'post_ordered_by_votes',
        'post_ordered_by_votes.id = posts.id',
      )
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.topics', 'topics');

    return <Promise<PostOverview>>queryBuilder.getMany();
  }

  public findHottestPosts(
    searchQuery: SearchCriteria,
    author: UserCredential | undefined,
  ) {
    const queryBuilder = this.createQueryBuilder('posts')
      .addSelect(
        `post_ordered_by_votes.total_votes as "posts_total_votes"
        , ${this.getSelectIsAuthorQuery(author)}`,
      )
      .innerJoin(
        (qb) => {
          qb.select('posts.id as id, COUNT(votes.id) as total_votes')
            .from(Post, 'posts')
            .leftJoin('votes', 'votes', 'votes.post_id = posts.id')
            .groupBy('posts.id')
            .limit(searchQuery.limit)
            .offset(searchQuery.offset)
            .orderBy('posts.updated_at', 'DESC');
          return qb;
        },
        'post_ordered_by_votes',
        'post_ordered_by_votes.id = posts.id',
      )
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.topics', 'topics');
    return <Promise<PostOverview>>queryBuilder.getMany();
  }

  private getSelectIsAuthorQuery(author: UserCredential | undefined) {
    return `CASE author.id
      WHEN ${author ? author.userId : null} THEN true
      ELSE false
    END as "posts_is_author"`;
  }
}
