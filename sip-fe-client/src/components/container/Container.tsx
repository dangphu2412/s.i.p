import React from 'react';
import './index.scss';

interface ContainerProps {
    children: React.ReactNode
}

export function Container(props: ContainerProps): JSX.Element {
    return (
        <div className='container my-10'>
            { props.children }
        </div>
    );
}
