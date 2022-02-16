import { Identity } from '@database/identity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/user.entity';
import { Post } from 'src/post/post.entity';
import { In, Repository } from 'typeorm';
import { UpsertDiscussionVoteDto } from './dto/upsert-discussion-vote.dto';
import { UpsertVoteDto } from './dto/upsert-vote.dto';
import { DiscussionVote } from './entities/vote-discussion.entity';
import { Vote } from './entities/vote.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote) private voteRepository: Repository<Vote>,
    @InjectRepository(DiscussionVote)
    private discussionVoteRepository: Repository<DiscussionVote>,
  ) {}

  async upsertForPostVote(voteDto: UpsertVoteDto) {
    return this.voteRepository
      .createQueryBuilder()
      .insert()
      .values({
        author: voteDto.author,
        post: voteDto.post,
      })
      .onConflict(
        'ON CONSTRAINT once_vote_post_per_author DO UPDATE SET is_voted = NOT votes.is_voted',
      )
      .execute();
  }

  async upsertForDiscussionVote(voteDto: UpsertDiscussionVoteDto) {
    return this.discussionVoteRepository
      .createQueryBuilder()
      .insert()
      .values({
        author: voteDto.author,
        discussion: voteDto.discussion,
      })
      .onConflict(
        'ON CONSTRAINT once_vote_discussion_per_author DO UPDATE SET is_voted = NOT discussion_votes.is_voted',
      )
      .execute();
  }

  public findByAuthorAndPosts(author: User, posts: Identity[]) {
    return this.voteRepository.find({
      where: {
        author,
        post: In(posts.map((post) => post.id)),
        isVoted: true,
      },
      loadRelationIds: true,
    });
  }

  public findByAuthorAndDiscussions(author: User, discussions: Identity[]) {
    return this.discussionVoteRepository.find({
      where: {
        author,
        discussions: In(discussions.map((discussion) => discussion.id)),
        isVoted: true,
      },
      loadRelationIds: true,
    });
  }

  public async didUserVoteForPost(author: User, post: Post) {
    return (await this.findByAuthorAndPosts(author, [post])).length > 0;
  }

  public countTotalVotesForPost(post: Post): Promise<number> {
    return this.voteRepository.count({
      where: {
        post,
      },
    });
  }
}
