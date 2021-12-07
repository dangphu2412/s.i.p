import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToggleVoteDto } from './dto/toggle-vote.dto';
import { Vote } from './vote.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote) private voteRepository: Repository<Vote>,
  ) {}

  async createOne(voteDto: ToggleVoteDto) {
    return this.voteRepository.upsert(voteDto, ['votes.author_id']);
  }
}
