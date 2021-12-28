import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { PostFilter } from '../../constants/post-filter.enum';

export function FilterDropdown() {
    const [selectedFilter, setSelectedFilter] = useState(PostFilter.HOTTEST);
    function handleFilterChoose(e: MenuInfo) {
        setSelectedFilter(e.key as PostFilter);
    }
    
    return (
        <div>
            <Dropdown overlay={
                <Menu onClick={handleFilterChoose}>
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
