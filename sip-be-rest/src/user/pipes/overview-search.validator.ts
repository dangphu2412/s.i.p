import {
  AbstractSearchValidator,
  SearchValidationSchema,
} from '@external/crud/search/pipes/search.validator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FetchUsersOverviewValidator extends AbstractSearchValidator {
  getSchema(): SearchValidationSchema {
    return {
      allowFilters: ['username'],
      allowSorts: ['username'],
    };
  }
}
