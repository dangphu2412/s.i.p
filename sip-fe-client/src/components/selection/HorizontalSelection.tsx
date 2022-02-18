import React from 'react';

export interface HorizontalSelectionProps extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
    items: string[];
    onSelect: (item: string) => void;
    value: string;
}

export function HorizontalSelection({items, value, className, onSelect, ...currentProps}: HorizontalSelectionProps): JSX.Element {
    return <div className={`flex justify-between ${className}`} {...currentProps}>
        {items.map(item => {
            return <div
                key={item}
                className={`flex cursor-pointer items-center ${value === item ? 'font-semibold' : ''}`}
                onClick={() => onSelect(item)}
            >
                <span>{item}</span>
            </div>;
        })}
    </div>;
}
