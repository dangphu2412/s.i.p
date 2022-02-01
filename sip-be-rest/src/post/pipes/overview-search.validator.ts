import {
  AbstractSearchValidator,
  SearchValidationSchema,
} from '@external/crud/search/pipes/search.validator';
import { Injectable } from '@nestjs/common';
import { FetchPostType } from '../enums/fetch-post-type.enum';

@Injectable()
export class FetchPostsOverviewValidator extends AbstractSearchValidator {
  getSchema(): SearchValidationSchema {
    return {
      allowFilters: ['type', 'topicName'],
      allowSorts: [],
      filterToMatchingMap: {
        type: (val) => Object.values(FetchPostType).includes(val),
      },
    };
  }
}
