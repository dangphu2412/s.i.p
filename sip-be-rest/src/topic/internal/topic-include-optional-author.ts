import { Topic } from '../topic.entity';

export interface TopicIncludeOptionalAuthor extends Topic {
  users_id?: number;
  topics_id?: number;
}
