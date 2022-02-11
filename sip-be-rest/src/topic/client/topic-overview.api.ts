import { Topic } from '../topic.entity';

export interface TopicSummary extends Omit<Topic, 'posts'> {
  followed: boolean;
}

export type TopicOverview = TopicSummary[];
