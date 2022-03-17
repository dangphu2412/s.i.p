import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { VIEW_SELECTOR } from 'src/constants/views.constants';
import { cleanData } from 'src/modules/data/data.action';
import { selectDataHolderByView } from 'src/modules/data/data.selector';
import { NotificationActions, NotificationPayload } from '../notification.action';

export function DropdownNotification(): JSX.Element {
    const dispatch = useDispatch();

    const [notification, setNotification] = useState<NotificationPayload>({
        notifications: [],
        unreadCount: 0,
        unreadNotifications: []
    });
    const [hasNews, setHasNews] = useState<boolean>(false);
    const notificationDataHolder = useSelector(selectDataHolderByView(VIEW_SELECTOR.FIND_NOTIFICATION));

    useEffect(() => {
        dispatch(NotificationActions.getNotifications());
    }, []);

    useEffect(() => {
        if (notificationDataHolder?.data) {
            setNotification(notificationDataHolder.data);
            if ((notificationDataHolder.data as NotificationPayload).unreadCount > 0) {
                setHasNews(true);
            }
        }

        return () => {
            dispatch(cleanData(VIEW_SELECTOR.FIND_NOTIFICATION));
        };
    }, [notificationDataHolder]);


    function handReadNews() {
        if (hasNews) {
            dispatch(NotificationActions.updateIsReadNotifications(notification.unreadNotifications.map(i => i.id)));
            setHasNews(false);
        }
    }

    return (
        <>
            <Dropdown
                className='mr-5 cursor-pointer'
                trigger={['click']}
                overlay={
                    <Menu>
                        {   notification.notifications.length > 0 ?
                            notification.notifications.map(item => {
                                return <Menu.Item key={item.id}>
                                    <Link to={item.link}>
                                        {item.title}
                                    </Link>
                                </Menu.Item>;
                            })
                            : <Menu.Item key={'EMPTY'}>
                            There is no new notifications
                            </Menu.Item>
                        }
                    </Menu>
                }
            >
                <div
                    onClick={handReadNews}
                >
                    <FontAwesomeIcon
                        icon={'bell'}
                        color={hasNews ? 'red' : 'black'}
                    />
                    {
                        hasNews && <span>{notification.unreadCount}</span>
                    }
                </div>
            </Dropdown>
        </>
    );
}
