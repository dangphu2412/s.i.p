import React from 'react';
import './index.scss';

export type Props = React.ComponentProps<'div'>;

export function Container({className, ...props}: Props): JSX.Element {
    return (
        <div className={`container ${className ? className : ''}`}
            {...props}
        >
            { props.children }
        </div>
    );
}
