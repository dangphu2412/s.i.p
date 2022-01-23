import { List, Comment, Divider, CommentProps } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { ChangeEvent, useState } from 'react';
import { CommentHandler } from './CommentHandler';
import { DiscussionEditor } from './Editor.component';

export function CommentContainer() {
    const [comments, setComments] = useState<CommentProps[]>([]);

    function handleSubmitComment(e: ChangeEvent<HTMLTextAreaElement>) {
        setComments([
            ...comments,
            {
                author: 'Han Solo',
                avatar: 'https://joeschmoe.io/api/v1/random',
                content: <p>Some comment</p>,
                datetime: Date.now(),
            },
        ]);

    }

    return (
        <>
            <Title level={5}>
                Tell us what do you think about our product?
            </Title>
 
            <DiscussionEditor
                authorAvatar='https://joeschmoe.io/api/v1/random'
                value=''
                onChange={handleSubmitComment}
            />

            <Divider style={{margin: 0}}/>

            {comments.length > 0 && <CommentHandler comments={comments} />}
        </>
    );
}
