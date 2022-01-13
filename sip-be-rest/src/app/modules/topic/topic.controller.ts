import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { SearchQuery } from '@external/crud/search/decorator/search.decorator';
import { OptionalProtected } from '@modules/auth/decorator/protected.decorator';
import { AuthContext } from '@modules/auth/decorator/user-cred.decorator';
import { UserCredential } from '@modules/auth/types/user-cred.interface';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
}
