import React from 'react';
import { useParams } from 'react-router-dom';
import { ClientLayout } from 'src/layouts/client/ClientLayout';

export function TopicDetailPage(): JSX.Element {
    const { slug } = useParams();

    if (!slug) {
        throw new Error('Missing topic id when render topic detail. Please check routing');
    }

    return (
        <ClientLayout>
            Hello topic detail
        </ClientLayout>
    );
}
