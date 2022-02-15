import { Button, Form, Input } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'src/components/container/Container';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { openAuthPopupAction } from 'src/modules/auth/auth.action';
import { AuthType } from 'src/modules/auth/auth.reducer';
import { selectAuthState } from 'src/modules/auth/auth.selector';
import { CreateDiscussionDto } from 'src/modules/discussion/api/discussion.api';
import { DiscussionActions } from 'src/modules/discussion/discussion.action';

export function CreateDiscussionPage(): JSX.Element {
    const dispatch = useDispatch();
    const [discussion, setDiscussion] = useState<CreateDiscussionDto>({
        title: '',
        content: '',
    });
    const authState = useSelector(selectAuthState);

    function createDiscussion() {
        if (authState !== AuthType.LOGGED_IN) {
            dispatch(openAuthPopupAction());
            return;
        }
        dispatch(DiscussionActions.createDiscussion(discussion));
        setDiscussion({
            content: '',
            title: '',
        });
    }

    return (<>
        <ClientLayout>
            <Container>
                <div className='py-10 flex justify-center'>
                    <div className='shadow hover:shadow-md rounded-md content-bg p-10 transition delay-100 w-full max-w-2xl'>
                        <Form
                            layout="vertical"
                            requiredMark={false}
                            className=''
                        >
                            <Title level={2}>
                                New Discussion
                            </Title>

                            <Form.Item required>
                                <Input
                                    size='large'
                                    bordered={false}
                                    placeholder="Title of discussion"
                                    value={discussion.title}
                                    onChange={(e) => setDiscussion({ ...discussion, title: e.target.value })}
                                />
                            </Form.Item>

                            <Form.Item required>
                                <TextArea
                                    className='resize-none'
                                    size='middle'
                                    bordered={false}
                                    rows={8}
                                    placeholder='Write your message here'
                                    value={discussion.content}
                                    onChange={(e) => setDiscussion({ ...discussion, content: e.target.value })}
                                />
                            </Form.Item>

                            <Button danger onClick={createDiscussion}>
                                Post
                            </Button>
                        </Form>
                    </div>
                </div>
            </Container>
        </ClientLayout>
    </>);
}
