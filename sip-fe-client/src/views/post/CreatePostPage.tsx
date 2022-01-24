import { Button, Col, Divider, Form, Input, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { CreatePostType } from 'src/modules/post/constants/create-type';
import { InitPost } from 'src/modules/post/post.action';
import { saveInitialPost } from 'src/modules/post/post.service';
import './create-post.scss';

interface CreateSelection {
    selected: boolean;
    type: CreatePostType | null;
}

export function CreatePostPage() {
    const navigate = useNavigate();
    const [createSelection, setCreateSeleciton] = useState<CreateSelection>({
        selected: false,
        type: null
    });

    function handleCreation(createPostType: CreatePostType) {
        setCreateSeleciton({
            selected: true,
            type: createPostType
        });
    }

    async function submitPost(values: Omit<InitPost, 'postType'>) {
        if (!createSelection.type) {
            throw new Error('Missing create post type');
        }

        const request = saveInitialPost({
            postType: createSelection.type,
            ...values
        });

        await request.doRequest();
        navigate('/posts/new/here_is_slug');
        
        return;
    }
    
    return (
        <ClientLayout>
            <Row>
                <Col span={10}>
                    <img
                        src='/img/idea.jpg'
                        alt='Idea background'
                        className='background-cover'
                    />
                </Col>

                <Col span={14} style={{padding: '2.5rem 15rem 2.5rem 5rem'}}>
                    <Title>
                        Tell us what you think?
                    </Title>

                    {
                        !createSelection.selected
                        && <div>
                            <Button
                                onClick={() => handleCreation(CreatePostType.CREATE_IDEA)}
                            >
                                I got an idea. Let &#39;s SIP thiis awesome ideaaaa!
                            </Button>

                            <Divider/>

                            <Button
                                onClick={() => handleCreation(CreatePostType.CREATE_PRODUCT)}
                            >
                                I got a product. Let &#39;s SIP this unstopable product
                            </Button>
                        </div>
                    }
                    
                    {
                        createSelection.type === CreatePostType.CREATE_IDEA
                        && <div
                            className='mb-5'
                        >
                            <Title level={4}>
                                Tell us your idea name first?
                            </Title>
                            <div>
                                Got an awesome idea?
                                Want to grow this idea to product?
                                You&#39;sre in the right place.
                                So relax and follow the steps.
                            </div>
                            
                        </div>
                    }

                    
                    {
                        createSelection.type === CreatePostType.CREATE_PRODUCT
                        && <div
                            className='mb-5'
                        >
                            <Title level={4}>
                                Give us your product link first?
                            </Title>
                            <div>
                                Found a cool product you want everyone to know about?
                                Or maybe you made one yourself and want the world to know about it?
                                You&#39;sre in the right place.
                                So relax and follow the steps.
                            </div>
                            
                        </div>
                    }

                    

                    <Form
                        labelCol={{span: 4}}
                        labelAlign='left'
                        wrapperCol={{span: 20}}
                        onFinish={submitPost}
                    >
                        {
                            createSelection.selected
                            && <Form.Item
                                name='name'
                                label='Idea name'
                            >
                                <Input
                                    placeholder='Your idea name'
                                    required
                                />
                            </Form.Item>
                        }

                        {
                            createSelection.selected
                            && createSelection.type === CreatePostType.CREATE_PRODUCT
                            && <Form.Item
                                name='productLink'
                                label='Product link'
                            >
                                <Input
                                    placeholder='Your product url ...'
                                />
                            </Form.Item>
                        }

                        {
                            createSelection.selected
                            && <div>
                                <Button htmlType='submit'>Get started</Button>
                                <Button
                                    className='ml-3'
                                    onClick={() => setCreateSeleciton({
                                        selected: false,
                                        type: null
                                    })}
                                >
                                    Oops! I want to choose again
                                </Button>
                            </div>
                        }
                    </Form>

                </Col>
            </Row>
        </ClientLayout>
    );
}
