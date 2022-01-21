import React from 'react';
import './index.scss';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function Container(props: ContainerProps): JSX.Element {
    return (
        <div className={props.className ? `${props.className} container` : 'container '}>
            { props.children }
        </div>
    );
}
