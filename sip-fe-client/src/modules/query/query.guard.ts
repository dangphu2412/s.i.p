import { Query, QueryWithPage } from './interface';

export function hasPage(query: Query): query is QueryWithPage {
    return !!query.page;
}