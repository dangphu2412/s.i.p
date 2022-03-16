import { CaretUpOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button, List, Tooltip, Modal } from 'antd';
import Title from 'antd/lib/typography/Title';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { openAuthPopupAction } from 'src/modules/auth/auth.action';
import { AuthType } from 'src/modules/auth/auth.reducer';
import { DateUtils } from 'src/modules/utils/date.utils';
import { VoteActions } from 'src/modules/vote/vote.action';
import { DiscussionSummary } from '../../api/discussion.api';
import { DiscussionActions } from '../../discussion.action';

export interface DiscussionCardProps extends DiscussionSummary {
    authType: AuthType;
    crudExtension?: {
        canUpdate: boolean
        canDelete: boolean
        readonly: boolean
    }
}

interface VoteBody {
    isVoted: boolean;
    totalVotes: number;
}

export function DiscussionCard(props: DiscussionCardProps): JSX.Element {
    const dispatch = useDispatch();
    const [vote, setVote] = useState<VoteBody>({
        isVoted: props.isVoted,
        totalVotes: props.totalVotes
    });

    function onVoteEvent(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault();
        if (props.authType !== AuthType.LOGGED_IN) {
            dispatch(openAuthPopupAction());
            return;
        }
        setVote({
            isVoted: !vote.isVoted,
            totalVotes: vote.totalVotes + (vote.isVoted ? -1 : 1)
        });
        dispatch(VoteActions.voteForDiscussion(props.id));
    }

    function onDelete() {
        Modal.confirm({
            title: 'Are you sure you want to delete this discussion?',
            icon: <ExclamationCircleOutlined />,
            content: <>
                <p>
                    You are about to delete your discussion.
                </p>
            </>,
            okType: 'danger',
            onOk() {
                dispatch(DiscussionActions.deleteDiscussion(props.id));
            }
        });
    }

    return (
        <List.Item.Meta
            className='my-3 mr-10'
            key={props.id}
            avatar={
                <div className='flex'>
                    <div>
                        <Avatar shape='circle' size={42} src={props.author.avatar} />
                    </div>
                    <div
                        className='flex flex-col items-center justify-center mx-8 cursor-pointer'
                        onClick={onVoteEvent}
                    >
                        <CaretUpOutlined className={vote.isVoted ? 'btn-color' : ''}/>
                        {vote.totalVotes}
                    </div>
                </div>
            }
            title={
                <Link
                    to={`/discussions/${props.slug}`}
                >
                    <Title level={5}>
                        {props.title}
                    </Title>
                </Link>
            }
            description={
                <div className='flex justify-between'>
                    <Link
                        to={`/discussions/${props.slug}`}
                    >
                        <div>
                            <span>{props.author.fullName}</span>
                            <span className='mx-5'>
                                <span className='mr-2'>
                                    {props.totalReplies}
                                </span>
                                <span className='mr-2'>
                                Replies
                                </span>
                                <span className='mr-2'>
                                    {DateUtils.diff(new Date(), new Date(props.createdAt))}
                                </span>
                            </span>
                        </div>

                    </Link>
                    {
                        !isEmpty(props.crudExtension) &&
                        <Tooltip
                            color={'#fff'}
                            title={<>
                                {
                                    props.crudExtension?.canUpdate &&
                                    <Button className='mx-1'>
                                        <Link to={`/discussions/${props.slug}/edit`}>
                                        Update
                                        </Link>
                                    </Button>
                                }
                                {
                                    props.crudExtension?.canDelete &&
                                    <Button
                                        danger
                                        className='mx-1'
                                        onClick={onDelete}>
                                        Delete
                                    </Button>
                                }
                            </>}
                        >
                            <FontAwesomeIcon
                                icon={'ellipsis-h'}
                                className='cursor-pointer'
                            />
                        </Tooltip>
                    }
                </div>
            }
        />
    );
}
