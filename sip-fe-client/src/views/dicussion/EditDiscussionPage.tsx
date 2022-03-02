import { Button, Form, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { cleanData } from 'src/modules/data/data.action';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { DiscussionDetail } from 'src/modules/discussion/api/discussion.api';
import { DiscussionActions } from 'src/modules/discussion/discussion.action';
import './create.scss';

export function EditDiscussionPage(): JSX.Element {
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
    const detailDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_DISCUSSION_DETAIL));

    useEffect(() => {
        dispatch(DiscussionActions.getDiscussionDetail(slug));
    }, []);

    useEffect(() => {
        if (detailDataHolder?.data) {
            setDetail(detailDataHolder.data);
        }
        return () => {
            dispatch(cleanData(VIEW_SELECTOR.FIND_DISCUSSION_DETAIL));
        };
    }, [detailDataHolder]);


    function updateDiscussion() {
        dispatch(DiscussionActions.updateDiscussion(detail));
    }

    return (
        <ClientLayout className='background' style={{backgroundImage: 'url(\'/img/discussion-create.jpg\')'}}>
            <Container className='h-full'>
                <div className='flex justify-center items-center h-full'>
                    <div className='shadow hover:shadow-md rounded-md content-bg p-10 transition delay-100 w-full max-w-2xl'>
                        <Form
                            layout="vertical"
                            requiredMark={false}
                            className=''
                        >
                            <Title level={2}>
                                Edit your discussion
                            </Title>

                            <Form.Item required>
                                <Input
                                    size='large'
                                    bordered={false}
                                    placeholder="Title of discussion"
                                    value={detail.title}
                                    onChange={(e) => setDetail({ ...detail, title: e.target.value })}
                                />
                            </Form.Item>

                            <Form.Item required>
                                <TextArea
                                    className='resize-none'
                                    size='middle'
                                    bordered={false}
                                    rows={8}
                                    placeholder='Write your message here'
                                    value={detail.content}
                                    onChange={(e) => setDetail({ ...detail, content: e.target.value })}
                                />
                            </Form.Item>

                            <Button danger onClick={updateDiscussion}>
                                Update
                            </Button>
                        </Form>
                    </div>
                </div>
            </Container>
        </ClientLayout>
    );
}
