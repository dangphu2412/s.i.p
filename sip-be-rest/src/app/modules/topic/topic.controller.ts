import { SearchCriteria } from '@external/crud/search/core/search-criteria';
import { SearchQuery } from '@external/crud/search/decorator/search.decorator';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FetchTopicsOverviewValidator } from './pipes/overview.validator';
import { TopicService } from './topic.service';

@ApiTags('topics')
@Controller('v1/topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}
  findMany(
    @SearchQuery(FetchTopicsOverviewValidator) searchQuery: SearchCriteria,
  ) {
    return this.topicService.findMany(searchQuery);
  }
}
