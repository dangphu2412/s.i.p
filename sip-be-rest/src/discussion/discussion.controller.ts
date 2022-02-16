import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { UserCredential } from '@auth/client/user-cred';
import {
  OptionalProtected,
  Protected,
} from '@auth/decorator/protected.decorator';
import { AuthContext } from '@auth/decorator/user-cred.decorator';
import { SearchQuery } from '@external/crud/search/decorator/search.decorator';
import { RuleManager } from '@external/racl/core/rule.manager';
import { ExtractRuleManager } from '@external/racl/decorator/get-manager.decorator';
import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
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

  @OptionalProtected
  @Get()
  findMany(
    @SearchQuery(FetchDiscussionOverviewValidator)
    searchCriteria: SearchCriteria,
    @AuthContext() authContext: UserCredential | undefined,
  ) {
    return this.discussionService.findManyDiscussion(
      searchCriteria,
      authContext,
    );
  }

  @Protected
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscussionDto: UpdateDiscussionDto,
    @AuthContext() author: UserCredential,
    @ExtractRuleManager() ruleManager: RuleManager,
  ) {
    updateDiscussionDto.authorId = +author.userId;
    return this.discussionService.update(+id, updateDiscussionDto, ruleManager);
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
