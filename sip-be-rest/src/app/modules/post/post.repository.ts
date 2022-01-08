import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { UserCredential } from '@modules/auth/types/user-cred.interface';
import { EntityRepository, Repository } from 'typeorm';
import { Post } from './post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  public findLatestPosts(
    searchQuery: SearchCriteria,
    author: UserCredential | undefined,
  ) {
    const queryBuilder = this.createQueryBuilder('posts')
      .addSelect(
        `vote_count as "posts_vote_count"
        , ${this.getSelectIsAuthorQuery(author)}`,
      )
      .innerJoin(
        (qb) => {
          qb.select('posts.id as id, COUNT(votes.id) as vote_count')
            .from(Post, 'posts')
            .leftJoin('votes', 'votes', 'votes.post_id = posts.id')
            .groupBy('posts.id')
            .orderBy('vote_count', 'DESC')
            .limit(searchQuery.limit)
            .offset(searchQuery.offset);
          return qb;
        },
        'post_ordered_by_votes',
        'post_ordered_by_votes.id = posts.id',
      )
      .leftJoinAndSelect('posts.author', 'author')
      .leftJoinAndSelect('posts.topics', 'topics');

    return queryBuilder.getMany();
  }

  public findHottestPosts(
    searchQuery: SearchCriteria,
    author: UserCredential | undefined,
  ) {
    const queryBuilder = this.createQueryBuilder('posts')
      .addSelect(
        `vote_count as "posts_vote_count"
        , ${this.getSelectIsAuthorQuery(author)}`,
      )
      .innerJoin(
        (qb) => {
          qb.select('posts.id as id, COUNT(votes.id) as vote_count')
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
    return queryBuilder.getMany();
  }

  private getSelectIsAuthorQuery(author: UserCredential | undefined) {
    return `CASE author.id
      WHEN ${author ? author.userId : null} THEN true
      ELSE false
    END as "posts_is_author"`;
  }
}
