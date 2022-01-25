import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { Injectable } from '@nestjs/common';
import { UserCredential } from 'src/auth/client/user-cred';
import { FindManyOptions, ILike } from 'typeorm';
import { TopicOverview, TopicSummary } from './client/topic-overview.api';
import { TopicIncludeOptionalAuthor } from './internal/topic-include-optional-author';
import { Topic } from './topic.entity';
import { TopicRepository } from './topic.repository';

@Injectable()
export class TopicService {
  constructor(private topicRepository: TopicRepository) {}

  public async findMany(
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
    const findManyOptions: FindManyOptions<Topic> = {
      skip: searchQuery.offset,
      take: searchQuery.limit,
    };
    if (searchQuery.search) {
      findManyOptions.where = {
        name: ILike(`%${searchQuery.search}%`),
      };
    }
    const topics = await this.topicRepository.find(findManyOptions);
    return topics.map(this.toTopicOverview);
  }

  public findByIds(ids: string[]) {
    return this.topicRepository.find({
      where: ids,
    });
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
