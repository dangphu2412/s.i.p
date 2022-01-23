import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import React from 'react';

interface FilterDropdownProps {
    selectedValue: string;
    setSelected: React.Dispatch<React.SetStateAction<any>>;
    options: string[];
}

export function FilterDropdown(props: FilterDropdownProps): JSX.Element {
    function handleFilterChosen(e: MenuInfo) {
        props.setSelected(e.key);
    }
    
    return (
        <div>
            <Dropdown overlay={
                <Menu onClick={handleFilterChosen}>
                    {
                        props.options.map(option => {
                            return <Menu.Item key={option}>
                                {option}
                            </Menu.Item>;
                        })
                    }
                </Menu>
            }>
                <a className="btn-color text-lg" onClick={e => e.preventDefault()}>
                    {props.selectedValue} <DownOutlined />
                </a>
            </Dropdown>
        </div>
    );
}
