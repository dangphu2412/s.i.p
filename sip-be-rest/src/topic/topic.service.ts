import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '@user/user.entity';
import { UserService } from '@user/user.service';
import { keyBy } from 'lodash';
import { UserCredential } from 'src/auth/client/user-cred';
import { In } from 'typeorm';
import { TopicOverview } from './client/topic-overview.api';
import { Topic } from './topic.entity';
import { TopicRepository } from './topic.repository';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly userService: UserService,
  ) {}

  public async findMany(
    searchQuery: SearchCriteria,
    authContext: UserCredential | undefined,
  ): Promise<TopicOverview> {
    const topics = await this.topicRepository.searchWithPagination(searchQuery);
    if (authContext) {
      const author = await this.userService.findByIdWithFollowedTopics(
        +authContext.userId,
      );
      if (!author) {
        throw new UnprocessableEntityException(
          `User with id: ${authContext.userId} is not available at the moment`,
        );
      }
      return this.mapFollowedTopicsByAuthor(topics, author);
    }
    return this.mapFollowedTopicsByAuthor(topics, undefined);
  }

  public async followTopicByAuthor(topicId: number, authorId: number) {
    const [user, topic] = await Promise.all([
      this.userService.findByIdWithFollowedTopics(authorId),
      this.topicRepository.findOne(topicId),
    ]);

    if (!user) {
      throw new UnprocessableEntityException(
        `User with id: ${authorId} is not available at the moment`,
      );
    }

    if (!topic) {
      throw new NotFoundException('Topic is not found');
    }

    const newFollowedTopics = user.followedTopics.filter(
      (followedTopic) => followedTopic.id !== topic.id,
    );

    if (newFollowedTopics.length === user.followedTopics.length) {
      user.followedTopics.push(topic);
    } else {
      user.followedTopics = newFollowedTopics;
    }

    await this.userService.save(user);
  }

  public findByIds(ids: string[]) {
    return this.topicRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  public async findOneBySlug(
    slug: string,
    authContext: UserCredential | undefined,
  ) {
    let user: User | undefined;
    const topic = await this.topicRepository.findOne({
      where: {
        slug,
      },
    });
    if (!topic) {
      throw new NotFoundException('Topic is not found');
    }
    if (authContext) {
      user = await this.userService.findByIdWithFollowedTopics(
        +authContext.userId,
      );
    }
    return this.mapFollowedTopicsByAuthor([topic], user)[0];
  }

  public findTopicsWithFollowers(ids: string[]) {
    return this.topicRepository.find({
      where: {
        id: In(ids),
      },
      relations: ['followers'],
    });
  }

  private mapFollowedTopicsByAuthor(
    topics: Topic[],
    author: User | undefined,
  ): TopicOverview {
    if (!author) {
      return topics.map((topic) => {
        return {
          ...topic,
          followed: false,
        };
      });
    }

    const topicsKeyById = keyBy(author.followedTopics, 'id');

    return topics.map((topic) => {
      return {
        ...topic,
        followed: !!topicsKeyById[topic.id],
      };
    });
  }
}
