import { Query } from 'src/modules/query/interface';

export interface DataHolder {
    view: string;
    data: any[];
    query?: Partial<Query>;
}

export interface DataHolders {
    [key: string]: DataHolder;
}