import './home.scss'
import React, { useState } from 'react'
import { Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Space } from 'antd';
import CityManage from '../cityManage/cityManage';


const items = [
    {
        label: '城市治理',
        key: 'mail',
    },
    {
        label: '文化旅游',
        key: 'app',
    },
    {
        label: '社会治理',
        key: 'SubMenu',
        children: [
            {
                key: 'gongan',
                label: '公安系统',

            },
            {
                key: 'xiaofang',
                label: '消防系统',

            },
            {
                key: 'yiliao',

                label: '医疗系统',

            },
        ],
    },
    {
        label: '灾害应急',
        key: 'yingji',
        children: [
            {
                key: 'gongan',
                label: '气象预警',

            },
            {
                key: 'xiaofang',
                label: '实时监测',

            },
            {
                key: 'yiliao',

                label: '应急抢险',

            },
        ],
    },
    {
        label: '智能环卫',
        key: 'app',
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
            <div className='content'>
                <CityManage />
            </div>
            {/* <div className="footer">这里是尾部</div> */}
        </div>


    )
}
