import { Spin } from 'antd';
import React, { useEffect } from 'react';
import './load-more.scss';

export function LoadMore() {
    useEffect(() => {
        addEvent();
    }, []);
    
    function addEvent() {
        console.log('Added');

        const spinElement = document.querySelector<HTMLElement>('.spin-center');
        if (spinElement) {
            window.addEventListener('scroll', () => {  
                if (window.innerHeight + window.scrollY > spinElement.scrollHeight) {  
                    console.log('scrolled to bottom');  
                }  
            });
            console.log('Added 2');

        }
    }
    return (
        <div className="spin-center"
        >
            <Spin />
        </div>
    );
}
