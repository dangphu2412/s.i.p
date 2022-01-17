import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';

export class UpsertVoteDto {
  public author: User;
  public post: Post;
}
