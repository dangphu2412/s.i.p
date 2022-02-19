import { Discussion } from 'src/discussion/discussion.entity';
import { User } from 'src/user/user.entity';

export class UpsertDiscussionVoteDto {
  public author: User;
  public discussion: Discussion;
}
