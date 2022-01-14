import { Post } from '../post.entity';

export interface PostDetail extends Post {
  voteCount: number;
}
