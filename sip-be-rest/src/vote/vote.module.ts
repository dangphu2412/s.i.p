import { DiscussionVote } from '@vote/entities/vote-discussion.entity';
import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, DiscussionVote])],
  providers: [VoteService],
  exports: [VoteService],
})
export class VoteModule {}
