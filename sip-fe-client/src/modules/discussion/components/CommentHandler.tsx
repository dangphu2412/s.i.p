import { List, Comment } from 'antd';
import React from 'react';

export function CommentHandler({ comments }: { comments: any[] }) {
    let i = 0;
    return (
        <List
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
            itemLayout="horizontal"
            renderItem={props => {
                i++;
                return <Comment key={i} {...props} />;
            }}
        />
    );
}
