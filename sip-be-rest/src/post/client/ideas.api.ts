import { Post } from '@post/post.entity';

export interface Idea extends Post {
  isFollowed: boolean;
}
