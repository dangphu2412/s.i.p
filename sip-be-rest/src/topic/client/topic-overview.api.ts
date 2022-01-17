import { Topic } from '../topic.entity';

export interface TopicSummary extends Omit<Topic, 'posts'> {
  isAuthor: boolean;
}

export type TopicOverview = TopicSummary[];
