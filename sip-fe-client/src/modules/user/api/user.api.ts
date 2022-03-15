import { Profile } from 'src/modules/auth/auth.service';
import { Topic } from 'src/modules/topic/api/topic.api';

export type Author = User

export interface User {
    id: string;
    fullName: string;
    avatar: string;
    headline: string;
    createdAt?: Date;
}

export interface ProfileDetail extends Profile {
    createdAt: Date;
    followedTopics: Topic[];
}
