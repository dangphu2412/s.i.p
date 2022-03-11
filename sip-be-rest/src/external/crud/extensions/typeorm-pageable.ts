import { InternalServerErrorException } from '@nestjs/common';
import { Pageable } from '../page/pageable';
import { SearchCriteria } from '../search/core/search-criteria';

function isFindAndCount<T>(
  records: T[] | [T[], number],
): records is [T[], number] {
  return records.length === 2 && typeof records[1] === 'number';
}

export function toPage<T>(
  records: T[] | [T[], number],
  search: SearchCriteria,
) {
  if (!records) {
    throw new InternalServerErrorException('Cannot cast into page format');
  }
  if (isFindAndCount(records)) {
    return new Pageable(records[0], {
      page: search.page,
      size: search.limit,
      totalCount: records[1] as number,
    });
  }
  return new Pageable(records as T[], {
    page: search.page,
    size: search.limit,
  });
}

export const PageExtension = {
  toInfinitivePage<T>(records: T[] | [T[], number], search: SearchCriteria) {
    if (records.length > search.limit) {
      records.pop();
      const pageable = toPage(records, search);
      pageable.meta.hasNextPage = true;
      return pageable;
    }
    const pageable = toPage(records, search);
    pageable.meta.hasNextPage = false;
    return pageable;
  },
};
