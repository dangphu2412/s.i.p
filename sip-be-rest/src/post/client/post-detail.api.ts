import { Post } from '../post.entity';

export interface DetailPostView extends Post {
  voteCount: number;
}
