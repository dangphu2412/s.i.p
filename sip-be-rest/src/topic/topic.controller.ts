import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { SearchQuery } from '@external/crud/search/decorator/search.decorator';
import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserCredential } from 'src/auth/client/user-cred';
import {
  OptionalProtected,
  Protected,
} from 'src/auth/decorator/protected.decorator';
import { AuthContext } from 'src/auth/decorator/user-cred.decorator';
import { FetchTopicsOverviewValidator } from './pipes/overview.validator';
import { TopicService } from './topic.service';

@ApiTags('topics')
@Controller('v1/topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  @OptionalProtected
  findMany(
    @SearchQuery(FetchTopicsOverviewValidator) searchQuery: SearchCriteria,
    @AuthContext() author: UserCredential | undefined,
  ) {
    return this.topicService.findMany(searchQuery, author);
  }

  @Protected
  @Patch('/:id/follow')
  followTopic(
    @Param('id') id: string,
    @AuthContext() authContext: UserCredential,
  ) {
    return this.topicService.followTopicByAuthor(+id, +authContext.userId);
  }
}
