import { CaretUpOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { openAuthPopupAction } from 'src/modules/auth/auth.action';
import { AuthType } from 'src/modules/auth/auth.reducer';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { cleanData } from 'src/modules/data/data.action';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { DiscussionDetail } from 'src/modules/discussion/api/discussion.api';
import { DiscussionContainer } from 'src/modules/discussion/components/DiscussionContainer';
import { DiscussionActions } from 'src/modules/discussion/discussion.action';
import { DateUtils } from 'src/modules/utils/date.utils';
import { VoteActions } from 'src/modules/vote/vote.action';

interface VoteBody {
    isVoted: boolean;
    totalVotes: number;
}

export function DiscussionDetailPage(): JSX.Element {
    const { slug } = useParams();

    if (!slug) {
        throw new Error('Missing topic id when render topic detail. Please check routing');
    }

    const dispatch = useDispatch();

    const [detail, setDetail] = useState<DiscussionDetail>({
        id: 'UNKNOWN',
        title: '',
        slug: '',
        content: '',
        createdAt: new Date().toISOString(),
        author: {
            id: 'UNKNOWN',
            avatar: '',
            fullName: '',
            headline: '',
        },
        isVoted: false,
        totalReplies: 0,
        totalVotes: 0,
    });
    const [vote, setVote] = useState<VoteBody>({
        isVoted: false,
        totalVotes: 0,
    });
    const detailDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_DISCUSSION_DETAIL));

    const authState = useSelector(selectAuthState);

    useEffect(() => {
        dispatch(DiscussionActions.getDiscussionDetail(slug));
    }, []);

    useEffect(() => {
        if (detailDataHolder?.data) {
            setDetail(detailDataHolder.data as DiscussionDetail);
        }
        return () => {
            dispatch(cleanData(VIEW_SELECTOR.FIND_DISCUSSION_DETAIL));
        };
    }, [detailDataHolder]);


    function onVoteEvent(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        e.preventDefault();
        if (authState !== AuthType.LOGGED_IN) {
            dispatch(openAuthPopupAction());
            return;
        }
        setVote({
            isVoted: !vote.isVoted,
            totalVotes: vote.totalVotes + (vote.isVoted ? -1 : 1)
        });
        dispatch(VoteActions.voteForDiscussion(detail.id));
    }

    return (
        <ClientLayout>
            <Container>
                <div className='py-10'>
                    <div>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>
                                <Link to='/topics'>Discussions</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to={`/topics/${detail.slug}`}>
                                    {detail.title}
                                </Link>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <Row className='mt-5'>
                        <Col span={2}>
                            <Button className='sticky' style={{height: '64px', width: '52px'}} onClick={onVoteEvent}>
                                <div>
                                    <CaretUpOutlined />
                                </div>
                                {detail.totalVotes}
                            </Button>
                        </Col>
                        <Col span={16}>
                            <Title>
                                {detail.title}
                            </Title>

                            <div>
                                <span className='mr-3'>
                                    {
                                        detail.author.fullName
                                    }
                                </span>
                                <span className='mr-3'>
                                    {
                                        DateUtils.diff(new Date(), new Date(detail.createdAt))
                                    }
                                </span>
                                <span className='mr-3'>
                                    {
                                        `${detail.totalReplies} repl${detail.totalReplies > 1 ? 'ies' : 'y'}`
                                    }
                                </span>
                            </div>

                            <div className='pt-5'>
                                {
                                    detail.content
                                }
                            </div>

                            <DiscussionContainer slug={slug}/>
                        </Col>
                        <Col span={6}>
                            Here text
                        </Col>
                    </Row>
                </div>
            </Container>
        </ClientLayout>
    );
}
