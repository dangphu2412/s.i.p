import {
  AbstractSearchValidator,
  SearchValidationSchema,
} from '@external/crud/search/pipes/search.validator';
import { Injectable } from '@nestjs/common';
import { FetchDetailType } from '../enums/fetch-post-type.enum';

@Injectable()
export class FetchPostsDetailValidator extends AbstractSearchValidator {
  getSchema(): SearchValidationSchema {
    return {
      allowFilters: ['type'],
      allowSorts: [],
      filterToMatchingMap: {
        type: (val) => Object.values(FetchDetailType).includes(val),
      },
    };
  }
}
