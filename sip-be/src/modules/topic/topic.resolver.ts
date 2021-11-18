import { Resolver } from '@nestjs/graphql';
import { TopicService } from './topic.service';

@Resolver()
export class TopicResolver {
  constructor(private readonly topicService: TopicService) {}
}
