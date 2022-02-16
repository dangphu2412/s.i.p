import { UserCredential } from '@auth/client/user-cred';
import { AccessRights } from '@constants/access-rights.enum';
import { Identity } from '@database/identity';
import { CreateDiscussionDto } from '@discussion/dto/create-discussion.dto';
import { FilterUtils } from '@external/crud/common/pipes/filter.pipe';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { RuleManager } from '@external/racl/core/rule.manager';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@post/post.entity';
import { User } from '@user/user.entity';
import { UserService } from '@user/user.service';
import { DiscussionVote } from '@vote/entities/vote-discussion.entity';
import { VoteService } from '@vote/vote.service';
import { keyBy } from 'lodash';
import { TreeRepository } from 'typeorm';
import { UpsertDiscussionVoteDto } from './../vote/dto/upsert-discussion-vote.dto';
import { DiscussionOverview } from './client/discussion-overview';
import { GetDiscussionType } from './constants/get-discussion-type.enum';
import { DiscussionRepository } from './discussion.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { Comment } from './entities/comment.entity';
import { Discussion } from './entities/discussion.entity';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: TreeRepository<Comment>,
    private readonly discussionRepository: DiscussionRepository,
    private readonly voteService: VoteService,
    private readonly userService: UserService,
  ) {}

  public async createComment(
    post: Post,
    createDiscussionDto: CreateCommentDto,
    author: User,
  ) {
    createDiscussionDto.content = createDiscussionDto.content.trim();

    if (!createDiscussionDto.content) {
      throw new BadRequestException('Content of comment can not be empty');
    }

    const comment = new Comment();

    comment.content = createDiscussionDto.content;
    comment.author = author;
    comment.post = post;
    comment.parent = null;

    await this.commentRepository.save(comment);

    return comment;
  }

  public async createReply(
    commentId: string,
    createReplyDto: CreateCommentDto,
    author: User,
    post: Post,
  ) {
    createReplyDto.content = createReplyDto.content.trim();

    if (!createReplyDto.content) {
      throw new BadRequestException('Content of comment can not be empty');
    }

    const discussion = await this.commentRepository.findOne(commentId);

    if (!discussion) {
      throw new NotFoundException('No parent comment found');
    }

    const reply = new Comment();

    reply.content = createReplyDto.content;
    reply.author = author;
    reply.parent = discussion;
    reply.post = post;
    return this.commentRepository.save(reply);
  }

  public async createDiscussion(
    createDiscussionDto: CreateDiscussionDto,
    authContext: UserCredential,
  ) {
    createDiscussionDto.content = createDiscussionDto.content.trim();

    if (!createDiscussionDto.content) {
      throw new BadRequestException('Content of discussion can not be empty');
    }

    const discussion = new Discussion();

    discussion.title = createDiscussionDto.title;
    discussion.content = createDiscussionDto.content;
    discussion.author = await this.userService.findById(+authContext.userId);

    return this.discussionRepository.save(discussion);
  }

  public async findManyDiscussion(
    searchCriteria: SearchCriteria,
    authContext: UserCredential | undefined,
  ): Promise<DiscussionOverview> {
    const getType = FilterUtils.get(searchCriteria.filters, 'type');
    let discussions: DiscussionOverview;
    switch (getType) {
      case GetDiscussionType.NEW:
        discussions = await this.discussionRepository.findLatest(
          searchCriteria,
        );
        break;
      case GetDiscussionType.POPULAR:
      default:
        throw new BadRequestException('Unexpected get type');
    }
    const user: User | null = authContext
      ? await this.userService.findById(+authContext.userId)
      : null;
    await this.markIsVotedByAuthor(discussions, user);
    return discussions;
  }

  public findDiscussionsOfPost(post: Post, searchCriteria: SearchCriteria) {
    return this.commentRepository.find({
      where: {
        post,
        parent: null,
      },
      relations: ['author', 'replies', 'replies.author'],
      skip: searchCriteria.offset,
      take: searchCriteria.limit,
    });
  }

  public async update(
    id: number,
    updateDiscussionDto: UpdateDiscussionDto,
    ruleManager: RuleManager,
  ) {
    const comment = await this.commentRepository.findOne(id);

    if (!comment) {
      throw new NotFoundException('No comment found for updating');
    }

    ruleManager.throwIfCannot(AccessRights.RootAccess.EDIT_OWN, {
      authorId: updateDiscussionDto.authorId,
      ownerId: comment.author.id,
    });

    if (comment.content !== updateDiscussionDto.content) {
      comment.content = updateDiscussionDto.content;
      await this.commentRepository.update(id, comment);
    }
  }

  public async upsertVoteOfDiscussion(
    discussionId: number,
    authContext: UserCredential,
  ) {
    const discussion = await this.discussionRepository.findOne(discussionId);

    if (!discussion) {
      throw new UnprocessableEntityException(
        'Post you are voting is not available',
      );
    }

    const user = await this.userService.findById(+authContext.userId);

    if (!user) {
      throw new UnprocessableEntityException(
        'User is not available to create post now',
      );
    }

    const voteDto = new UpsertDiscussionVoteDto();

    voteDto.author = user;
    voteDto.discussion = discussion;

    return this.voteService.upsertForDiscussionVote(voteDto);
  }

  private async markIsVotedByAuthor(
    discussions: DiscussionOverview,
    optionalAuthor: User | undefined,
  ) {
    if (optionalAuthor) {
      const discussionVotes: DiscussionVote[] =
        await this.voteService.findByAuthorAndDiscussions(
          optionalAuthor,
          <Identity[]>discussions,
        );

      const discussionMap = keyBy(discussionVotes, 'discussion');

      discussions.forEach((discussion) => {
        discussion.isVoted = !!discussionMap[`${discussion.id}`];
      });

      return;
    }

    discussions.forEach((discussion) => {
      discussion.isVoted = false;
    });
  }
}
