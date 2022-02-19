import { UserCredential } from '@auth/client/user-cred';
import { CommentService } from '@comment/comment.service';
import { CreateCommentDto } from '@comment/dto/create-comment.dto';
import { Identity } from '@database/identity';
import { FilterUtils } from '@external/crud/common/pipes/filter.pipe';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from '@user/user.entity';
import { UserService } from '@user/user.service';
import { SlugUtils } from '@utils/slug';
import { UpsertDiscussionVoteDto } from '@vote/dto/upsert-discussion-vote.dto';
import { DiscussionVote } from '@vote/entities/vote-discussion.entity';
import { VoteService } from '@vote/vote.service';
import { keyBy } from 'lodash';
import { DiscussionOverview } from './client/discussion-overview';
import { GetDiscussionType } from './constants/get-discussion-type.enum';
import { Discussion } from './discussion.entity';
import { DiscussionRepository } from './discussion.repository';
import { CreateDiscussionDto } from './dto/create-discussion.dto';

@Injectable()
export class DiscussionService {
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly voteService: VoteService,
    private readonly userService: UserService,
    private readonly commentService: CommentService,
  ) {}

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
    discussion.slug = SlugUtils.normalizeWithUUID(createDiscussionDto.title);
    discussion.author = await this.userService.findById(+authContext.userId);

    return this.discussionRepository.save(discussion);
  }

  public async createCommentForDiscussion(
    slug: string,
    createDiscussionDto: CreateCommentDto,
    authContext: UserCredential,
  ) {
    const discussion = await this.discussionRepository.findBySlug(slug);

    if (!discussion) {
      throw new NotFoundException('Not found post with slug ' + slug);
    }

    const author = await this.userService.findById(+authContext.userId);

    if (!author) {
      throw new UnprocessableEntityException('User is not available');
    }

    return this.commentService.createCommentForDiscussion(
      discussion,
      createDiscussionDto,
      author,
    );
  }

  public async createReplyOForDiscussion(
    slug: string,
    commentId: string,
    createDiscussionDto: CreateCommentDto,
    authContext: UserCredential,
  ) {
    const discussion = await this.discussionRepository.findBySlug(slug);

    if (!discussion) {
      throw new NotFoundException('Not found post with slug ' + slug);
    }

    const author = await this.userService.findById(+authContext.userId);

    if (!author) {
      throw new UnprocessableEntityException('User is not available');
    }

    return this.commentService.createReplyForDiscussion(
      commentId,
      createDiscussionDto,
      author,
      discussion,
    );
  }

  public async findCommentsOfDiscussion(
    slug: string,
    searchCriteria: SearchCriteria,
  ) {
    const discussion = await this.discussionRepository.findBySlug(slug);

    if (!discussion) {
      throw new UnprocessableEntityException(
        `Post with id: ${slug} does not exist that cannot find discussions`,
      );
    }
    return this.commentService.findCommentsOfDiscussion(
      discussion,
      searchCriteria,
    );
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
        discussions = [];
        break;
      default:
        throw new BadRequestException('Unexpected get type');
    }
    const user: User | null = authContext
      ? await this.userService.findById(+authContext.userId)
      : null;
    await this.markIsVotedByAuthor(discussions, user);
    return discussions;
  }

  public async findOneDiscussion(
    slug: string,
    authContext: UserCredential | undefined,
  ) {
    const discussion = await this.discussionRepository.findOneDetailBySlug(
      slug,
    );

    if (!discussion) {
      throw new NotFoundException('No discussion found');
    }

    const user: User | null = authContext
      ? await this.userService.findById(+authContext.userId)
      : null;

    await this.markIsVotedByAuthor([discussion], user);

    return discussion;
  }

  public async upsertVoteOfDiscussion(
    discussionId: number,
    authContext: UserCredential,
  ) {
    const discussion = await this.discussionRepository.findOne(discussionId);

    if (!discussion) {
      throw new UnprocessableEntityException(
        'Discussion you are voting is not available',
      );
    }

    const user = await this.userService.findById(+authContext.userId);

    if (!user) {
      throw new UnprocessableEntityException(
        'User is not available to create vote discussion now',
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
