import './login.scss'
import React from 'react'
import { Button, Checkbox, Form, Input } from 'antd';

import { useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate()

    const onFinish = () => {
        navigate('/')
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='main'>
            <div className='loginForm'>
                <div className='title'><h2>慧通云城系统</h2></div>
                <div >
                    <Form
                        name="basic"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 18,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            wrapperCol={{
                                offset: 5,
                                span: 16,
                            }}
                        >
                            <Checkbox>记住密码</Checkbox>
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 4,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                登录
                            </Button>
                            <Button style={{ marginLeft: '10px' }}>
                                注册
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <Button type='link'>忘记密码</Button>
            </div>
        </div>


    )
}
