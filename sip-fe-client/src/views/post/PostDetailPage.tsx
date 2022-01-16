import { Col, Image, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useParams } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { TopFeatureBadge } from 'src/modules/post/components/badge/TopFeatureBadge';
import { fetchPostDetail } from 'src/modules/post/post.action';

function onChange(currentSlide: number) {
    console.log(currentSlide);
}
  
const contentStyle: React.CSSProperties = {
    color: '#fff',
    textAlign: 'center',
    background: '#364d79',
};

export function PostDetailPage(): JSX.Element {
    const dispatch = useDispatch();
    const { postId } = useParams();
    const dataHolder = useSelector(selectDataHolderByView('POST_DETAIL'));

    if (!postId) {
        throw new Error('Please recheck your routing. Post detail view is missing postId with key: postId');
    }
    
    useEffect(() => {
        if (!dataHolder) {
            dispatch(fetchPostDetail({ postId }));
        }
    }, [dataHolder]);

    return (
        <ClientLayout>
            <Container>
                <Row>
                    <Col span={3}>
                        <Image
                            src="https://joeschmoe.io/api/v1/random"
                            style={{ width: 100, height: 100 }}
                            preview={false}
                        />
                    </Col>
                    <Col span={13}>
                        <Title level={4}>
                            This is title
                        </Title>
                        <div>This is description</div>
                        <span>Topic</span>
                        <span>Topic</span>
                    </Col>

                    <Col span={8}>
                        <TopFeatureBadge
                            rankTitle='#1 Product of the day'
                            dateRank={Date.now()}
                        />
                    </Col>
                </Row>

                <Row>
                    <Col span={16}>
                        <Carousel>
                            <div>
                                <Image
                                    src="https://ph-files.imgix.net/02eab590-4b2e-46a0-8eb8-2ec59cc51d2f.png?auto=format&auto=compress&codec=mozjpeg&cs=strip&w=640&h=380&fit=max&bg=0fff"
                                    style={contentStyle}
                                    preview={false}
                                />
                            </div>
                            <div>
                                <Image
                                    src="https://ph-files.imgix.net/02eab590-4b2e-46a0-8eb8-2ec59cc51d2f.png?auto=format&auto=compress&codec=mozjpeg&cs=strip&w=640&h=380&fit=max&bg=0fff"
                                    style={contentStyle}
                                    preview={false}
                                />
                            </div>
                        </Carousel>
                    </Col>

                    <Col span={8}>
                        Others
                    </Col>
                </Row>
            </Container>
        </ClientLayout>
    );
}
