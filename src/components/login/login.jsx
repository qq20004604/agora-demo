/**
 * Created by 王冬 on 2020/6/12.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import React, {useEffect, useState} from 'react';
import {notification, Table, Tooltip, Button, Input, Form, Radio, PageHeader} from 'antd';
import $ajax from 'api/ajax.js';
import utils from 'common/js/utils.js'

const layout = {
    labelCol: {span: 2},
    wrapperCol: {span: 6}
};

const tailLayout = {
    wrapperCol: {offset: 3, span: 16}
};

function Login (props) {
    const {login} = props;

    const [form] = Form.useForm();

    const onFinish = values => {
        console.log('Success:', values);
        const payload = {
            app_id: values.app_id,
            channel: values.channel,
            token: values.token || ''
        }
        // if (switchStatus) {
        //     payload.pub_name = values.pub_name || ''
        // }
        console.log(payload);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return <Form {...layout}
                 name="basic"
                 form={form}
                 initialValues={{
                     app_id: 'bcda2aa9db8449c580b4d171869cb883',
                     channel: 'abc',
                     token: '006cf9abb98e1ce47349ec0bc63814ee93aIADt5KukQIxmZUS'
                 }}
                 onFinish={onFinish}
                 onFinishFailed={onFinishFailed}>
        <Form.Item label="App 密钥"
                   name='app_id'>
            <Input placeholder="请输入App密钥"/>
        </Form.Item>
        <Form.Item label="频道名"
                   name='channel'>
            <Input placeholder="请输入频道名"/>
        </Form.Item>
        <Form.Item label="Token"
                   name='token'>
            <Input placeholder="请输入 Token"/>
        </Form.Item>

        <Form.Item {...tailLayout}>
            <Button type="primary"
                    disabled={null}
                    htmlType="submit">
                提交
            </Button>
        </Form.Item>
    </Form>
}

export default Login
