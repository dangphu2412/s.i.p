import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import React from 'react';

interface FilterDropdownProps<T> {
    selectedValue: string;
    setSelected: React.Dispatch<React.SetStateAction<T>>;
    options: string[];
}

export function FilterDropdown<T>(props: FilterDropdownProps<T>): JSX.Element {
    function handleFilterChosen(e: MenuInfo) {
        props.setSelected((e.key as unknown) as T);
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
