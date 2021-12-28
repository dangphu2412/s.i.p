interface Filter {
  column: string;
  value: string;
  comparator: string;
}

interface Sort {
  direction: string;
  column: string;
}

interface Page {
    page: number;
    size: number;
}

export interface Query {
    filter?: Filter[];
    sort?: Sort[];
    search?: string;
    page?: Page;
}


export type QueryState = Required<Query>