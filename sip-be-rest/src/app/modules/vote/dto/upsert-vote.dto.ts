import { Post } from '@modules/post/post.entity';
import { User } from '@modules/user/user.entity';

export class UpsertVoteDto {
  public user: User;
  public post: Post;
}
