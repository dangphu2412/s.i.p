import { Discussion } from '@discussion/entities/discussion.entity';
import { User } from 'src/user/user.entity';

export class UpsertDiscussionVoteDto {
  public author: User;
  public discussion: Discussion;
}
