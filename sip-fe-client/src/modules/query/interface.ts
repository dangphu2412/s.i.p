export interface Filter {
  column: string;
  value: string;
  comparator: string;
}

export interface Sort {
  direction: string;
  column: string;
}

export interface Page {
    page: number;
    size: number;
}

export interface Query {
    filters: Filter[];
    sorts: Sort[];
    search?: string;
    page?: Page;
}

export type QueryWithPage = Query & {
  page: Page;
}

export type QueryState = Required<Query>