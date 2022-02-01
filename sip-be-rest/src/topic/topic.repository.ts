import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { UserCredential } from 'src/auth/client/user-cred';
import { EntityRepository, Repository } from 'typeorm';
import { TopicIncludeOptionalAuthor } from './internal/topic-include-optional-author';
import { Topic } from './topic.entity';

@EntityRepository(Topic)
export class TopicRepository extends Repository<Topic> {
  public findTopicsIncludeOptionalAuthor(
    searchQuery: SearchCriteria,
    author: UserCredential,
  ): Promise<TopicIncludeOptionalAuthor[]> {
    const SQL = `
      SELECT * FROM (
        SELECT * FROM topics
        WHERE topics.name ILIKE $4
        LIMIT $1 OFFSET $2
      ) as topics
      LEFT JOIN (
        SELECT * FROM users_topics
        WHERE users_topics.users_id = $3
      ) as topic_link_follower_id
      on topic_link_follower_id.topics_id = topics.id
    `;
    return this.query(SQL, [
      searchQuery.limit,
      searchQuery.offset,
      author.userId,
      `%${searchQuery.search || ''}%`,
    ]);
  }
}
