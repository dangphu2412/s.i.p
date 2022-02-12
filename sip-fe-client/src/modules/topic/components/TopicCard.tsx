import { List, Avatar, Button } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openAuthPopupAction } from 'src/modules/auth/auth.action';
import { AuthType } from 'src/modules/auth/auth.reducer';
import { TopicWithFollowStatus } from '../api/topic.api';
import { TopicActions } from '../topic.action';

export interface TopicCardProps {
    data: TopicWithFollowStatus;
    authState: AuthType;
    className?: string;
}

export function TopicCard(props: TopicCardProps) {
    const dispatch = useDispatch();
    const { data, authState } = props;
    const [followed, setFollowed] = useState(props.data.followed);
    
    function handleFollow(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        e.preventDefault();
        if (authState !== AuthType.LOGGED_IN) {
            dispatch(openAuthPopupAction());
            return;
        }
        dispatch(TopicActions.followTopic(data.id));
        setFollowed(!followed);
    }

    return (
        <div className={`flex justify-between items-center ${props.className ? props.className: ''}` }>
            <List.Item.Meta
                avatar={<Avatar shape='square' size={86} src={`${data.avatar}`} />}
                title={<a href={`/topics/${data.slug}`}>{data.name}</a>}
                description={data.summary}
            />
            <Button
                danger={followed}
                onClick={handleFollow}
                style={{width: '126px'}}
                className='ml-5'
            >
                {
                    followed ? 'Following' : 'Follow'
                }
            </Button>
        </div>
    );
}
