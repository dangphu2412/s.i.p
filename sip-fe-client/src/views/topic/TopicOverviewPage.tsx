import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row, Col, Input, Select } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import { Container } from 'src/components/container/Container';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { GetTopicType } from 'src/modules/topic/constants/get-topic-type.enum';
import { TopicOverviewContainer } from 'src/modules/topic/components/TopicOverviewContainer';

export function TopicOverviewPage(): JSX.Element {
    const [filterSelected, setFilterSelected] = useState<GetTopicType>(GetTopicType.TRENDING);

    return (
        <ClientLayout>
            <Container>
                <div className='py-10'>
                    <Row>
                        <Col span={16}>
                            <Title>
                                Topics
                            </Title>
                            <div className='p-color'>
                                Follow your favorite topics to be the first to learn about the newest product arrivals in that space.
                                You&apos;ll get the most out of Product Hunt if you follow at least three, with notifications about new launches every time you visit.
                            </div>
                            <div className='flex justify-between my-5'>
                                <Input
                                    className='bg-sky-light max-w-xs'
                                    placeholder="Search Topics ..."
                                    suffix={ <FontAwesomeIcon icon='search'/> }
                                />

                                <Select 
                                    defaultValue={filterSelected}
                                    style={{ width: 120 }}
                                    onSelect={filter => { setFilterSelected(filter);}}
                                >
                                    {
                                        Object.keys(GetTopicType).map((typeKey) => {
                                            return <Select.Option
                                                key={typeKey} 
                                                value={typeKey}
                                            >
                                                {GetTopicType[typeKey as keyof typeof GetTopicType]}
                                            </Select.Option>;
                                        })
                                    }
                                </Select>
                            </div>

                            <TopicOverviewContainer
                                filterType={filterSelected}
                            />
                        </Col>
                        <Col span={8}></Col>
                    </Row>
                </div>
            </Container>
        </ClientLayout>
    );
}
