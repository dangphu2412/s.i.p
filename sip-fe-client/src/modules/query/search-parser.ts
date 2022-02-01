import { ArrayUtils } from 'src/utils/array.utils';
import { Filter, Query, Sort } from './interface';
import { hasPage } from './query.guard';

function parseFilterToString(filter: Filter): string {
    return `${filter.column}|${filter.comparator}|${filter.value}`;
}

function parseSortToString(sort: Sort): string {
    return `${sort.column}|${sort.direction}`;
}

export function parseToSearchParams(query: Query): URLSearchParams {
    const searchParams = new URLSearchParams();
    if (hasPage(query)) {
        searchParams.append('page', query.page.page.toString());
        searchParams.append('limit', query.page.size.toString());
    }

    if (!ArrayUtils.isEmpty(query.filters)) {
        query.filters.forEach(filter => {
            searchParams.append('filter', parseFilterToString(filter));
        });
    }

    if (!ArrayUtils.isEmpty(query.sorts)) {
        query.sorts.forEach(sort => {
            searchParams.append('filter', parseSortToString(sort));
        });
    }

    if (query.search) {
        searchParams.append('search', query.search);
    }

    return searchParams;
}