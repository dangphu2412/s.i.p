import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
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
                            return <Menu.Item danger key={option}>
                                {option}
                            </Menu.Item>;
                        })
                    }
                </Menu>
            }>
                <Button danger>
                    {props.selectedValue} <DownOutlined />
                </Button>
            </Dropdown>
        </div>
    );
}
