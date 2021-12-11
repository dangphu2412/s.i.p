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
      .orIgnore('once_per_author')
      .execute();
  }
}
