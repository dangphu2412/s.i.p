import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/user.entity';
import { Post } from 'src/post/post.entity';
import { In, Repository } from 'typeorm';
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

  public findByAuthorAndPosts(author: User, posts: Post[]) {
    return this.voteRepository.find({
      where: {
        author,
        post: In(posts.map((post) => post.id)),
        isVoted: true,
      },
      loadRelationIds: true,
    });
  }

  public async didUserVoteForPost(author: User, post: Post) {
    return (await this.findByAuthorAndPosts(author, [post])).length > 0;
  }
}
