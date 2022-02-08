import React from 'react';

export function Footer(): JSX.Element {
    const infoLinks = [
        {
            body: 'Questions',
            link: '/questions'
        },
        {
            body: 'FAQ',
            link: '/faq'
        },
        {
            body: 'About',
            link: '/about'
        },
        {
            body: 'Facebook',
            link: 'https://www.facebook.com/communitySiP'
        }
    ];
    return <div className='text-xs'>
        <div className='my-3'>
            {
                infoLinks.map(info => {
                    return <a
                        className='mr-3 btn-color'
                        key={info.body}
                        href={info.link}
                        target='_blank' rel="noreferrer"
                    >
                        {info.body}
                    </a>;
                })
            }
        </div>
        <div>
            ©2022 SIDE PROJECT
        </div>
    </div>;
}
