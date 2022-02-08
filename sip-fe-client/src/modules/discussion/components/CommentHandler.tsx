import { Avatar, Comment, CommentProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { openAuthPopupAction } from 'src/modules/auth/auth.action';
import { Profile } from 'src/modules/auth/auth.service';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { Reply } from '../api/discussion.api';
import { DiscussionActions } from '../discussion.action';
import { DiscussionEditor } from './Editor.component';

export interface CommentHandlerProps extends CommentProps {
    slug: string;
    key: string;
    commentId: string;
    profile: Profile | undefined;
}

export function CommentHandler(props: CommentHandlerProps) {
    const dispatch = useDispatch();
    const [replyDisplayed, setReplyDisplayed] = useState(false);
    const [currentReply, setCurrentReply] = useState('');
    const [replies, setReplies] = useState<Reply[]>([]);
    const replyCreatedResponse = useSelector(selectDataHolderByView(VIEW_SELECTOR.CREATE_REPLY));

    useEffect(() => {
        if (replyCreatedResponse?.data) {
            if (replyCreatedResponse.data.parent.id === props.commentId) {
                setReplies([
                    ...replies,
                    replyCreatedResponse.data as Reply
                ]);
            }
        }
    }, [replyCreatedResponse]);

    function handleReplyEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && e.shiftKey == false) {
            e.preventDefault();
            if (!props.profile) {
                dispatch(openAuthPopupAction());
                return;
            }
            dispatch(DiscussionActions.createReply({
                commentId: props.commentId,
                content: currentReply,
                slug: props.slug
            }));
            setCurrentReply('');
        }
    }

    function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setCurrentReply(e.target.value);
    }
    
    return (
        <Comment
            {...props}
            actions={props.profile ? [
                <span
                    key={props.key}
                    onClick={() => {setReplyDisplayed(!replyDisplayed);}}
                >
                    Reply
                </span>,
                <span key={props.key}>Edit</span>
            ] : []}
        >
            {
                replyDisplayed && <DiscussionEditor
                    authorAvatar={props.avatar}
                    value={currentReply}
                    onKeyDown={handleReplyEnter}
                    onChange={onChange}
                />
            }
            {
                replies.length > 0 &&
                replies.map(reply => {
                    return (
                        <Comment
                            key={reply.id}
                            author={reply.author.fullName}
                            avatar={<Avatar src={reply.author.avatar} />}
                            content={reply.content}
                            datetime={reply.updatedAt}
                        ></Comment>
                    );
                })
            }
        </Comment>
    );
}
