import { Filter } from './interface';

export const FilterService = {
    findByColumn(column: string, filters: Filter[]): Filter | undefined {
        return filters.find(filter => filter.column === column);
    }
};