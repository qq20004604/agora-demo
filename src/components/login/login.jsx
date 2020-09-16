/**
 * Created by 王冬 on 2020/6/12.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import React, {useEffect, useState} from 'react';
import {notification, Table, Tooltip, Button, Input, Form, Radio, Switch, Select} from 'antd';
import $ajax from 'api/ajax.js';
import utils from 'common/js/utils.js'
import AgoraRTC from 'common/js/AgoraRTCSDK.min.js';

// copy from demo
function getDevices (next) {
    AgoraRTC.getDevices(function (items) {
        console.log(items);
        items.filter(function (item) {
            return ['audioinput', 'videoinput'].indexOf(item.kind) !== -1
        })
            .map(function (item) {
                return {
                    name: item.label,
                    value: item.deviceId,
                    kind: item.kind
                }
            })
        let videos = []
        let audios = []
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            if ('videoinput' === item.kind) {
                let name = item.label
                let value = item.deviceId
                if (!name) {
                    name = 'camera-' + videos.length
                }
                videos.push({
                    name: name,
                    value: value,
                    kind: item.kind
                })
            }
            if ('audioinput' === item.kind) {
                let name = item.label
                let value = item.deviceId
                if (!name) {
                    name = 'microphone-' + audios.length
                }
                audios.push({
                    name: name,
                    value: value,
                    kind: item.kind
                })
            }
        }
        next({videos: videos, audios: audios})
    })
}

function validator (formData) {
    const fields = ['appID', 'channel'];
    const keys = Object.keys(formData)
    for (let key of keys) {
        if (fields.indexOf(key) != -1) {
            if (!formData[key]) {
                notification.error({
                    message: 'Please Enter ' + key
                })
                return false
            }
        }
    }
    return true
}

const layout = {
    labelCol: {span: 24},
    wrapperCol: {span: 24}
};

const tailLayout = {
    wrapperCol: {offset: 0, span: 24}
};

const {Option} = Select;

function Login (props) {
    const {join, leave, logining} = props;
    const [showmore, setShowmore] = useState(false);
    const [cameraIdList, setCameraIdList] = useState([]);
    const [microphoneIdList, setMicrophoneIdList] = useState([]);

    const [form] = Form.useForm();
    window.form = form;

    useEffect(() => {
        getDevices(function (devices) {
            const videosList = devices.videos.map(vedio => {
                return {
                    name: vedio.name,
                    value: vedio.value
                }
            })
            setCameraIdList(videosList);
            form.setFieldsValue({
                cameraId: videosList[0].value
            })
            const audioList = devices.audios.map(audio => {
                return {
                    name: audio.name,
                    value: audio.value
                }
            })
            setMicrophoneIdList(audioList)
            form.setFieldsValue({
                microphoneId: audioList[0].value
            })
        })
    }, [])

    const onFinish = values => {
        console.log('Success:', values);
        const payload = form.getFieldsValue();
        // 验证不通过，直接返回
        if (!validator(payload)) {
            return;
        }
        // if (switchStatus) {
        //     payload.pub_name = values.pub_name || ''
        // }
        join(payload)
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return <Form {...layout}
                 name="basic"
                 layout="vertical"
                 form={form}
                 initialValues={{
                     appID: 'bcda2aa9db8449c580b4d171869cb883',
                     channel: 'abc',
                     token: '006cf9abb98e1ce47349ec0bc63814ee93aIADt5KukQIxmZUS+GFbwQXguL/pdDRIxFbdpDcEld7SxTsJBJDUAAAAAEABmqXDyIDViXwEAAQAgNWJf',
                     mode: 'live',
                     codec: 'h264',
                     cameraResolution: 'default',
                     uid: ''
                 }}
                 onFinish={onFinish}
                 onFinishFailed={onFinishFailed}>
        <Form.Item label="App 密钥"
                   name='appID'>
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
        <Form.Item label="高级设置">
            <Switch checkedChildren="展开" unCheckedChildren="收起"
                    checked={showmore}
                    onClick={isChecked => setShowmore(isChecked)}/>
        </Form.Item>
        <div style={{display: showmore ? 'block' : 'none'}}>
            <Form.Item label="UID"
                       name='uid'>
                <Input placeholder="请输入 UID"/>
            </Form.Item>
            <Form.Item label="CAMERA"
                       name='cameraId'>
                <Select>
                    {
                        cameraIdList.length > 0 ? cameraIdList.map(item => {
                            console.log(item.name);
                            return <Option value={item.value} key={item.value}>{item.name}</Option>
                        }) : <Option value={''}></Option>
                    }
                </Select>
            </Form.Item>
            <Form.Item label="MICROPHONE"
                       name='microphoneId'>
                <Select>
                    {
                        microphoneIdList.length > 0 ? microphoneIdList.map(item => {
                            return <Option value={item.value} key={item.value}>{item.name}</Option>
                        }) : <Option value={''}></Option>
                    }
                </Select>

            </Form.Item>
            <Form.Item label="CAMERA RESOLUTION"
                       name='cameraResolution'>
                <Select>
                    <Option value="default">default</Option>
                    <Option value="480p">480p</Option>
                    <Option value="720p">720p</Option>
                    <Option value="1080p">1080p</Option>
                </Select>
            </Form.Item>
            <Form.Item label="MODE"
                       name='mode'>
                <Radio.Group>
                    <Radio.Button value="live">live</Radio.Button>
                    <Radio.Button value="rtc">rtc</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="CODEC"
                       name='codec'>
                <Radio.Group>
                    <Radio.Button value="h264">h264</Radio.Button>
                    <Radio.Button value="vp8">vp8</Radio.Button>
                </Radio.Group>
            </Form.Item>
        </div>
        <Form.Item {...tailLayout}>
            <Button type="primary"
                    disabled={logining}
                    htmlType="submit">
                JOIN
            </Button>
            <Button disabled={!logining}
                    onClick={leave}>
                LEAVE
            </Button>
        </Form.Item>
    </Form>
}

export default Login
