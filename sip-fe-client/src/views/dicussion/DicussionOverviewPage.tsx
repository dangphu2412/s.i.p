import React from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'src/components/container/Container';
import { ClientLayout } from 'src/layouts/client/ClientLayout';

export function DiscussionOverviewPage(): JSX.Element {
    const dispatch = useDispatch();

    return (<>
        <ClientLayout>
            <Container>
                <div className='py-10'>
                    Discussions overview
                </div>
            </Container>
        </ClientLayout>
    </>);
}