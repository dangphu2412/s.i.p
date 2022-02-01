import { FilterCriteria } from '@external/crud/search/modules/filter';
import { ArrayUtils } from '@external/utils/array/array.utils';

export const FilterUtils = {
  has(filters: FilterCriteria[], key: string): boolean {
    return (
      ArrayUtils.isPresent(filters) &&
      filters.some((filter) => filter.column === key)
    );
  },
  get(filters: FilterCriteria[], key: string) {
    return filters.find((filter) => filter.column === key)?.value;
  },
};
