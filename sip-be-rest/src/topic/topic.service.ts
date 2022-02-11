import { SearchCriteria } from "@external/crud/search/core/search-criteria";
import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { UserCredential } from "src/auth/client/user-cred";
import { FindManyOptions, ILike, In } from "typeorm";
import { TopicOverview, TopicSummary } from "./client/topic-overview.api";
import { TopicIncludeOptionalAuthor } from "./internal/topic-include-optional-author";
import { Topic } from "./topic.entity";
import { TopicRepository } from "./topic.repository";
import { UserService } from "@user/user.service";

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly userService: UserService,
  ) {}

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

    const indexOfTopic = user.followedTopics.findIndex(
      (flTopic) => flTopic.id === topic.id,
    );

    if (indexOfTopic !== -1) {
      user.followedTopics.push(topic);
    } else {
      user.followedTopics = user.followedTopics.filter(
        (_, i) => i !== indexOfTopic,
      );
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
