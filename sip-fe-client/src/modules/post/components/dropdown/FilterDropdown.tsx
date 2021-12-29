import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { PostFilter } from '../../constants/post-filter.enum';
import { useDispatch } from 'react-redux';
import { queryChanged } from 'src/modules/query/query.action';

export function FilterDropdown(): JSX.Element {
    const [selectedFilter, setSelectedFilter] = useState(PostFilter.HOTTEST);
    const dispatch = useDispatch();

    function handleFilterChosen(e: MenuInfo) {
        setSelectedFilter(e.key as PostFilter);
        dispatch(queryChanged({ filter: [{
            column: 'type',
            comparator: 'eq',
            value: e.key
        }] }));
    }
    
    return (
        <div>
            <Dropdown overlay={
                <Menu onClick={handleFilterChosen}>
                    <Menu.Item key={PostFilter.HOTTEST}>
                        {PostFilter.HOTTEST}
                    </Menu.Item>
                    <Menu.Item key={PostFilter.NEWEST}>
                        {PostFilter.NEWEST}
                    </Menu.Item>
                </Menu>
            }>
                <a className="ant-dropdown-link text-lg" onClick={e => e.preventDefault()}>
                    {selectedFilter} <DownOutlined />
                </a>
            </Dropdown>
        </div>
    );
}
