import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Divider, Input, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { Footer } from 'src/components/footer/Footer';
import { HorizontalSelection } from 'src/components/selection/HorizontalSelection';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import { DiscussionCardContainer } from 'src/modules/discussion/components/card/DiscussionCardContainer';
import { GetDiscussionType } from 'src/modules/discussion/constants/get-discussion-type.enum';
import { ListingTopic } from 'src/modules/topic/components/ListingTopic';
import './overview.scss';

export function DiscussionOverviewPage(): JSX.Element {
    const navigate = useNavigate();
    const [filterSelected, setFilterSelected] = useState(GetDiscussionType.NEW);
    const [search, setSearch] = useState('');

    function onSearchEvent(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        setSearch(e.target.value);
    }

    return (<>
        <ClientLayout>
            <div
                className='title-wrapper title-background'
            >
                <Container>
                    <Title className='max-w-lg' >
                        Learn and engage with the Side Project community
                    </Title>
                    <div className='max-w-lg pb-3'>
                        Before joining or starting a discussion remember to always be civil.
                        Treat others with respect. Do not use the discussions board for direct sales or self-promotion.
                        You are free to share your products and product ideas for feedback. 🙌
                    </div>
                    <Button
                        danger
                        onClick={() => navigate('/discussions/new')}
                        size='large'
                    >
                        New discussion
                    </Button>
                </Container>
            </div>

            <Container>
                <div className='pt-5'>
                    <Row>
                        <Col span={16}>
                            <div className='flex justify-between'>
                                <HorizontalSelection
                                    value={filterSelected}
                                    onSelect={value => setFilterSelected(value as GetDiscussionType)}
                                    items={Object.values(GetDiscussionType)}
                                    className='w-full'
                                    style={{maxWidth: '100px'}}
                                />

                                <Input
                                    className='bg-sky-light max-w-xs'
                                    placeholder="Search Discussions ..."
                                    prefix={ <FontAwesomeIcon icon='search'/> }
                                    onChange={onSearchEvent}
                                    value={search}
                                />
                            </div>
                            <Divider/>
                            <DiscussionCardContainer
                                filter={filterSelected}
                                search={search}
                            />
                        </Col>

                        <Col span={1}/>

                        <Col span={7}>
                            <ListingTopic />

                            <Divider/>

                            <Footer/>
                        </Col>
                    </Row>
                </div>
            </Container>
        </ClientLayout>
    </>);
}
