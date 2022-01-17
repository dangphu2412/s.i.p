import {
  AbstractSearchValidator,
  SearchValidationSchema,
} from '@external/crud/search/pipes/search.validator';
import { Injectable } from '@nestjs/common';
import { FetchTopicType } from '../enums/fetch-topic-type.enum';

@Injectable()
export class FetchTopicsOverviewValidator extends AbstractSearchValidator {
  getSchema(): SearchValidationSchema {
    return {
      allowFilters: ['type'],
      allowSorts: [],
      filterToMatchingMap: {
        type: (val) => Object.values(FetchTopicType).includes(val),
      },
    };
  }
}
