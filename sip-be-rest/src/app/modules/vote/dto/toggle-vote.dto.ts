import { Post } from '@modules/post/post.entity';

export class ToggleVoteDto {
  public authorId: number;
  public post: Post;
}
