import { Author } from 'src/modules/user/api/user.api';

export interface Discussion {
    id: string;
    updatedAt: string;
    content: string;
    author: Author;
}

export interface Reply extends Discussion {
    parent: Discussion;
}