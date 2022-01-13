import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { UserCredential } from '@modules/auth/types/user-cred.interface';
import { Injectable } from '@nestjs/common';
import { TopicOverview, TopicSummary } from './client/topic-overview.api';
import { TopicIncludeOptionalAuthor } from './internal/topic-include-optional-author';
import { TopicRepository } from './topic.repository';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository) {}

  async findMany(
    searchQuery: SearchCriteria,
    author: UserCredential | undefined,
  ): Promise<TopicOverview> {
    if (author) {
      const topics = await this.topicRepository.findTopicsIncludeOptionalAuthor(
        searchQuery,
        author,
      );
      return topics.map(this.toTopicOverview);
    }
    const topics = await this.topicRepository.find({
      skip: searchQuery.offset,
      take: searchQuery.limit,
    });
    return topics.map(this.toTopicOverview);
  }

  private toTopicOverview(topic: TopicIncludeOptionalAuthor): TopicSummary {
    let isAuthor = false;
    if (topic.users_id && topic.topics_id) {
      isAuthor = true;
    }
    delete topic.users_id;
    delete topic.topics_id;
    return {
      ...topic,
      isAuthor,
    };
  }
}
