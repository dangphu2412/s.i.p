import { Button } from 'antd';
import Title from 'antd/lib/typography/Title';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'src/components/container/Container';
import { ClientLayout } from 'src/layouts/client/ClientLayout';
import './overview.scss';

export function DiscussionOverviewPage(): JSX.Element {
    const navigate = useNavigate();
    return (<>
        <ClientLayout>
            <div
                className='flex py-10 title-wrapper'
                style={{backgroundImage: 'url(\'https://www.interview-skills.co.uk/blog/wp-content/uploads/2015/07/How-to-stand-out-group-tasks-discussions.jpg\')'}}
            >
                <Container  className='items-center justify-center'>
                    <Title level={3} className='max-w-lg'>
                    Learn and engage with the Product Hunt community
                    </Title>
                    <div className='p-color max-w-lg'>
                    Before joining or starting a discussion remember to always be civil. Treat others with respect. Do not use the discussions board for direct sales or self-promotion. You are free to share your products and product ideas for feedback. 🙌
                    </div>
                    <Button onClick={() => navigate('/discussions/new')}>
                        New discussion
                    </Button>
                </Container>
            </div>
            <Container>
                <div className='py-10'>
                    Discussions overview
                </div>
            </Container>
        </ClientLayout>
    </>);
}
