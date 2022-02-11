export interface Topic {
  id: string;
  name: string;
  slug: string;
  summary: string;
  avatar: string;
}

export interface TopicWithFollowStatus extends Topic {
  followed: boolean;
}