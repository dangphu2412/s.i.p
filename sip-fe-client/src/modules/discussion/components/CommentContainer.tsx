import { Divider, List } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { openAuthPopupAction } from 'src/modules/auth/auth.action';
import { selectProfile } from 'src/modules/auth/auth.selector';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { Discussion } from '../api/discussion.api';
import { DiscussionActions } from '../discussion.action';
import { CommentHandler } from './CommentHandler';
import { DiscussionEditor } from './Editor.component';

export interface CommentContainerProps {
    slug: string;
}

export function CommentContainer({ slug }: CommentContainerProps): JSX.Element {
    const dispatch = useDispatch();
    const [comments, setComments] = useState<Discussion[]>([]);
    const [comment, setComment] = useState<string>('');
    const author = useSelector(selectProfile);
    const commentsDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_POST_COMMENTS));
    const commentCreatedResponse = useSelector(selectDataHolderByView(VIEW_SELECTOR.CREATE_COMMENT));

    useEffect(() => {
        if (slug) {
            dispatch(DiscussionActions.getPostComments({ slug }));
        }
    }, [slug]);

    useEffect(() => {
        if (commentsDataHolder?.data) {
            setComments(commentsDataHolder.data as Discussion[]);
        }
    }, [commentsDataHolder]);

    useEffect(() => {
        if (commentCreatedResponse?.data) {
            setComments([
                ...comments,
                commentCreatedResponse.data as Discussion
            ]);
        }
    }, [commentCreatedResponse]);

    function handleCommentEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && e.shiftKey == false) {
            e.preventDefault();
            if (!author) {
                dispatch(openAuthPopupAction());
                return;
            }

            setComment('');
            dispatch(DiscussionActions.createComment({
                content: comment,
                slug
            }));
        }

    }

    function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setComment(e.currentTarget.value);
    }

    return (
        <>
            <Title level={5}>
                Tell us what do you think about our product?
            </Title>

            <DiscussionEditor
                authorAvatar={author?.avatar || ''}
                value={comment}
                onKeyDown={handleCommentEnter}
                onChange={onChange}
            />

            <Divider style={{margin: 0}}/>

            {comments.length > 0 &&
                <List
                    dataSource={comments}
                    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
                    itemLayout="horizontal"
                    renderItem={props => {
                        return <CommentHandler
                            slug={slug}
                            key={`${props.id}`}
                            commentId={props.id}
                            profile={author}
                            author={props.author.fullName}
                            avatar={<Avatar src={props.author.avatar} />}
                            content={props.content}
                            datetime={props.updatedAt}
                            replies={props.replies}
                        />;
                    }}
                />
            }
        </>
    );
}
