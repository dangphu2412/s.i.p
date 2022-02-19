import { UserCredential } from '@auth/client/user-cred';
import {
  OptionalProtected,
  Protected,
} from '@auth/decorator/protected.decorator';
import { AuthContext } from '@auth/decorator/user-cred.decorator';
import { CreateCommentDto } from '@comment/dto/create-comment.dto';
import { toPage } from '@external/crud/extensions/typeorm-pageable';
import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { SearchQuery } from '@external/crud/search/decorator/search.decorator';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { FetchDiscussionOverviewValidator } from './pipes/discussion-overview.validator';

@ApiTags('discussions')
@Controller('v1/discussions')
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  @Protected
  @Post()
  createDiscussion(
    @Body() createDiscussionDto: CreateDiscussionDto,
    @AuthContext() authContext: UserCredential,
  ) {
    return this.discussionService.createDiscussion(
      createDiscussionDto,
      authContext,
    );
  }

  @Protected
  @Post(':slug/comments')
  async createComment(
    @Param('slug') slug: string,
    @Body() createDiscussionDto: CreateCommentDto,
    @AuthContext() author: UserCredential,
  ) {
    return this.discussionService.createCommentForDiscussion(
      slug,
      createDiscussionDto,
      author,
    );
  }

  @Protected
  @Post(':slug/comments/:commentId/replies')
  async createReply(
    @Param('slug') slug: string,
    @Param('commentId') commentId: string,
    @Body() createDiscussionDto: CreateCommentDto,
    @AuthContext() author: UserCredential,
  ) {
    return this.discussionService.createReplyOForDiscussion(
      slug,
      commentId,
      createDiscussionDto,
      author,
    );
  }

  @OptionalProtected
  @Get()
  async findMany(
    @SearchQuery(FetchDiscussionOverviewValidator)
    searchCriteria: SearchCriteria,
    @AuthContext() authContext: UserCredential | undefined,
  ) {
    const data = await this.discussionService.findManyDiscussion(
      searchCriteria,
      authContext,
    );
    return toPage(data, searchCriteria);
  }

  @OptionalProtected
  @Get('/:slug/comments')
  async findCommentsOfDiscussion(
    @Param('slug') slug: string,
    @SearchQuery()
    searchCriteria: SearchCriteria,
  ) {
    const data = await this.discussionService.findCommentsOfDiscussion(
      slug,
      searchCriteria,
    );
    return toPage(data, searchCriteria);
  }

  @OptionalProtected
  @Get('/:slug')
  async findOne(
    @Param('slug') slug: string,
    @AuthContext() authContext: UserCredential | undefined,
  ) {
    return this.discussionService.findOneDiscussion(slug, authContext);
  }

  @Protected
  @Put('/:id/votes')
  upsertVoteOfPost(
    @Param('id') id: string,
    @AuthContext() authContext: UserCredential,
  ) {
    return this.discussionService.upsertVoteOfDiscussion(+id, authContext);
  }
}
