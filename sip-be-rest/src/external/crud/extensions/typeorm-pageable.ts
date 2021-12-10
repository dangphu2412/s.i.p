import { Pageable } from '../page/pageable';
import { SearchCriteria } from '../search/core/search-criteria';

function isFindAndCount<T>(records: T[] | [T[], number]) {
  return records.length === 2 && typeof records[1] === 'number';
}

export function toPage<T>(
  records: T[] | [T[], number],
  search: SearchCriteria,
) {
  if (isFindAndCount(records)) {
    return new Pageable(records[0] as T[], {
      page: search.page,
      size: search.limit,
      totalCount: records[1] as number,
      pageCount: Math.floor((records[1] as number) / search.limit),
    });
  }
  return new Pageable(records as T[], {
    page: search.page,
    size: search.limit,
  });
}