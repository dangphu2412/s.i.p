import { Query, Resolver } from '@nestjs/graphql';
import { TopicType } from './entities/topic.type';
import { TopicService } from './topic.service';

@Resolver()
export class TopicResolver {
  constructor(private readonly topicService: TopicService) {}

  @Query(() => [TopicType], { name: 'topics' })
  public getTopics() {
    return this.topicService.getAll();
  }
}
