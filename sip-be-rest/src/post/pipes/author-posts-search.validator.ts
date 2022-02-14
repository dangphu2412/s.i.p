import {
  AbstractSearchValidator,
  SearchValidationSchema,
} from '@external/crud/search/pipes/search.validator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FetchAuthorPostsValidator extends AbstractSearchValidator {
  getSchema(): SearchValidationSchema {
    return {
      allowFilters: ['scope'],
      allowSorts: [],
    };
  }
}
