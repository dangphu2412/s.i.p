import { GetDiscussionType } from '@discussion/constants/get-discussion-type.enum';
import {
  AbstractSearchValidator,
  SearchValidationSchema,
} from '@external/crud/search/pipes/search.validator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FetchDiscussionOverviewValidator extends AbstractSearchValidator {
  getSchema(): SearchValidationSchema {
    return {
      allowFilters: ['type', 'hashTag'],
      allowSorts: [],
      filterToMatchingMap: {
        type: (val: any) => Object.values(GetDiscussionType).includes(val),
      },
    };
  }
}
