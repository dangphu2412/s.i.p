import { Comment } from 'antd';
import { Author } from 'src/modules/user/api/user.api';

export interface Comment {
    id: string;
    updatedAt: string;
    content: string;
    author: Author;
}

export interface Discussion extends Comment {
    replies: Reply[];
}

export interface Reply extends Comment {
    parent: Discussion;
}