import { UserCredential } from 'src/auth/client/user-cred';
import { Post } from 'src/post/post.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpsertVoteDto } from './dto/upsert-vote.dto';
import { Vote } from './vote.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote) private voteRepository: Repository<Vote>,
  ) {}

  async upsertOne(voteDto: UpsertVoteDto) {
    return this.voteRepository
      .createQueryBuilder()
      .insert()
      .values({
        author: voteDto.author,
        post: voteDto.post,
      })
      .onConflict(
        'ON CONSTRAINT once_per_author DO UPDATE SET is_voted = NOT votes.is_voted',
      )
      .execute();
  }

  public async didUserVoteForPost(
    author: UserCredential,
    post: Post,
  ): Promise<boolean> {
    return false;
  }
}
