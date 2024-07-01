import './home.scss'
import React, { useState } from 'react'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Space } from 'antd';

const items = [
    {
        label: '城市治理',
        key: 'mail',
        icon: <MailOutlined />,
    },
    {
        label: '文化旅游',
        key: 'app',
        icon: <AppstoreOutlined />,
    },
    {
        label: '社会治理',
        key: 'SubMenu',
        icon: <SettingOutlined />,
        children: [
            {
                type: 'group',
                label: '公安系统',
                children: [
                    {
                        label: 'Option 1',
                        key: 'setting:1',
                    },
                    {
                        label: 'Option 2',
                        key: 'setting:2',
                    },
                ],
            },
            {
                type: 'group',
                label: 'Item 2',
                children: [
                    {
                        label: 'Option 3',
                        key: 'setting:3',
                    },
                    {
                        label: 'Option 4',
                        key: 'setting:4',
                    },
                ],
            },
        ],
    },
    {
        key: 'alipay',
        label: (
            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                Navigation Four - Link
            </a>
        ),
    },
];

const Header = () => {
    const [current, setCurrent] = useState('mail');
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    return (
        <div className='headerBar'>
            <div className='menu'>
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
            </div>
            <div className='aviator'>
                <Space size={24}>
                    <Badge count={1}>
                        <Avatar shape="square" icon={<UserOutlined />} />
                    </Badge>
                </Space>
            </div>

        </div>
    );
};
export default function Home() {
    return (
        <div className='homeMain'>
            <div className='header'>
                <Header />
            </div>
            <div className='content'>这里是内容</div>
            {/* <div className="footer">这里是尾部</div> */}
        </div>


    )
}
