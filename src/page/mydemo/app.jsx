import React from 'react';
import ReactDOM from 'react-dom';
import 'common/css/reset.css';
import './style.scss';
import 'antd/dist/antd.css';
import $ajax from 'api/ajax.js';
import GLOBAL_VAR from 'common/config/variable'
import {Layout, Menu, Breadcrumb, notification} from 'antd';
import Login from 'component/login/login.jsx';
import Meet from 'component/meet/meet.jsx';
import AgoraRTC from 'common/js/AgoraRTCSDK.min.js';

const {Header, Content, Sider, Footer} = Layout;

class Root extends React.Component {
    state = {
        logining: false,

        // RTC
        client: null,
        joined: false,
        published: false,
        localStream: null,
        remoteStreams: [],
        params: {}
    };

    componentDidMount () {
        window.t = this;
    }

    render () {
        return <Layout>
            <Header style={{zIndex: 10, width: '100%'}}
                    id='header'>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">Agora DEMO</Menu.Item>
                </Menu>
            </Header>
            <Content style={{padding: '0 50px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>示例 DEMO</Breadcrumb.Item>
                    <Breadcrumb.Item>单对单</Breadcrumb.Item>
                </Breadcrumb>

                <Layout className="site-layout-content" style={{padding: '24px 0'}}>
                    <Sider className="site-layout-content" width={400}>
                        <Login join={this.join}
                               leave={this.leave}
                               joined={this.state.joined}
                               logining={this.state.logining}/>
                    </Sider>
                    <Content>
                        <Meet remoteStreams={this.state.remoteStreams}
                              params={this.state.params}/>
                    </Content>
                </Layout>

            </Content>
            <Footer style={{textAlign: 'center'}}>开发人：零零水（QQ：20004604，微信：qq20004604）</Footer>
        </Layout>;
    }

    join = params => {
        console.log('join params', params);
        const client = AgoraRTC.createClient({mode: params.mode, codec: params.codec})
        this.clientEvents(client, params);

        this.setState({
            logining: true,
            params,
            client
        }, () => {
            client.init(params.appID, () => {
                // debugger;
                console.log('init success')

                /**
                 * Joins an AgoraRTC Channel
                 * This method joins an AgoraRTC channel.
                 * Parameters
                 * tokenOrKey: string | null
                 *    Low security requirements: Pass null as the parameter value.
                 *    High security requirements: Pass the string of the Token or Channel Key as the parameter value. See Use Security Keys for details.
                 *  channel: string
                 *    A string that provides a unique channel name for the Agora session. The length must be within 64 bytes. Supported character scopes:
                 *    26 lowercase English letters a-z
                 *    26 uppercase English letters A-Z
                 *    10 numbers 0-9
                 *    Space
                 *    "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
                 *  uid: number | null
                 *    The user ID, an integer. Ensure this ID is unique. If you set the uid to null, the server assigns one and returns it in the onSuccess callback.
                 *   Note:
                 *      All users in the same channel should have the same type (number or string) of uid.
                 *      If you use a number as the user ID, it should be a 32-bit unsigned integer with a value ranging from 0 to (232-1).
                 **/
                client.join(params.token ? params.token : null, params.channel, params.uid ? +params.uid : null, (uid) => {
                    notification.info({
                        message: 'join channel: ' + params.channel + ' success, uid: ' + uid
                    })
                    console.log('join channel: ' + params.channel + ' success, uid: ' + uid)
                    const localStream = AgoraRTC.createStream({
                        streamID: uid,
                        audio: true,
                        video: true,
                        screen: false,
                        microphoneId: params.microphoneId,
                        cameraId: params.cameraId
                    })
                    this.setState({
                        joined: true,
                        params: Object.assign({}, params, {
                            uid
                        }),
                        // create local stream
                        localStream
                    })

                    // initialize local stream. Callback function executed after intitialization is done
                    localStream.init(() => {
                        console.log('init local stream success')
                        // play stream with html element id "local_stream"
                        // 在 div#local_stream 位置播放视频
                        localStream.play('local_stream')

                        // publish local stream
                        this.publish()
                    }, (err) => {
                        this.setState({
                            logining: false
                        })
                        notification.error({
                            message: 'stream init failed, please open console see more detail'
                        })
                        console.error('init local stream failed ', err)
                    })
                }, (err) => {
                    this.setState({
                        logining: false
                    })
                    notification.error({
                        message: 'client join failed, please open console see more detail'
                    })
                    console.error('client join failed', err)
                })
            }, (err) => {
                this.setState({
                    logining: false
                })
                notification.error({
                    message: 'client join failed, please open console see more detail'
                })
                console.error(err)
            })
        })
    }

    leave = () => {
        console.log('leave')
        if (!this.state.client) {
            notification.error({
                message: 'Please Join First!'
            })
            return
        }
        if (!this.state.joined) {
            notification.error({
                message: 'You are not in channel'
            })
            return
        }
        /**
         * Leaves an AgoraRTC Channel
         * This method enables a user to leave a channel.
         **/
        this.state.client.leave(() => {
            // stop stream
            if (this.state.localStream.isPlaying()) {
                this.state.localStream.stop()
            }
            // close stream
            this.state.localStream.close()
            this.setState({
                remoteStreams: [],
                localStream: null,
                client: null,
                published: false,
                joined: false
            })
            notification.success({
                message: 'leave success'
            })
        }, function (err) {
            notification.error({
                message: 'leave success'
            })
            console.log('channel leave failed')
            console.error(err)
        })
    }

    // from DEMO and modify for React
    clientEvents = (client, params) => {
        // Occurs when an error message is reported and requires error handling.
        // 报错
        client.on('error', (err) => {
            notification.error({
                message: JSON.stringify(err)
            })
            console.log(err)
        })
        // Occurs when the peer user leaves the channel; for example, the peer user calls Client.leave.
        // 用户退出
        client.on('peer-leave', (evt) => {
            const id = evt.uid;
            console.log('id', evt)
            let streams = this.state.remoteStreams.filter(e => id !== e.getId())
            let peerStream = this.state.remoteStreams.find(e => id === e.getId())
            if (peerStream && peerStream.isPlaying()) {
                peerStream.stop()
            }
            this.setState({
                remoteStreams: streams
            })
            // todo 如果离开的不是当前用户，移除该用户的 DOM
            if (id !== params.uid) {
                this.removeView(id)
            }
            notification.info({
                message: '用户已退出'
            })
            console.log('peer-leave', id)
        })
        // Occurs when the local stream is published.
        // 本地视频流推送到远程
        client.on('stream-published', (evt) => {
            notification.success({
                message: '视频流已成功推送到线上'
            })
            console.log('stream-published')
        })
        // Occurs when the remote stream is added.
        // 远程流新增
        client.on('stream-added', (evt) => {
            var remoteStream = evt.stream
            var id = remoteStream.getId()
            notification.info({
                message: 'stream-added uid: ' + id
            })
            if (id !== params.uid) {
                client.subscribe(remoteStream, function (err) {
                    console.log('stream subscribe failed', err)
                })
            }
            console.log('stream-added remote-uid: ', id)
        })
        // Occurs when a user subscribes to a remote stream.
        // 当一个用户订阅了远程流
        client.on('stream-subscribed', (evt) => {
            const remoteStream = evt.stream
            const id = remoteStream.getId()
            this.setState({
                remoteStreams: [...this.state.remoteStreams, remoteStream]
            })
            this.addView(remoteStream, id)
            client.subscribe(remoteStream, err => {
                notification.error({
                    message: JSON.stringify(err)
                })
                console.log('stream-subscribed remote-uid: ' + id)
            })
            console.log('stream-subscribed remote-uid: ', id)
        })
        // Occurs when the remote stream is removed; for example, a peer user calls Client.unpublish.
        // 用户离开
        client.on('stream-removed', (evt) => {
            var remoteStream = evt.stream
            var id = remoteStream.getId()
            notification.info({
                message: 'stream-removed uid: ' + id
            })
            if (remoteStream.isPlaying()) {
                remoteStream.stop()
            }
            const remoteStreams = this.state.remoteStreams.filter(function (stream) {
                return stream.getId() !== id
            })
            this.setState({
                remoteStreams
            })
            this.removeView(id)
            console.log('stream-removed remote-uid: ', id)
        })
        client.on('onTokenPrivilegeWillExpire', (evt) => {
            // After requesting a new token
            // client.renewToken(token);
            notification.info({
                message: 'onTokenPrivilegeWillExpire'
            })
            console.log('onTokenPrivilegeWillExpire')
        })
        client.on('onTokenPrivilegeDidExpire', (evt) => {
            // After requesting a new token
            // client.renewToken(token);
            notification.info({
                message: 'onTokenPrivilegeDidExpire'
            })
            console.log('onTokenPrivilegeDidExpire')
        })
    }

    addView = (remoteStream, id) => {
        // remoteStream.play('remote_video_' + id)
    }

    removeView = id => {

    }

    publish = () => {
        if (!this.state.client) {
            notification.error({
                message: '请先加入房间'
            })
            this.setState({
                logining: false
            })
            return
        }
        if (this.state.published) {
            notification.error({
                message: 'Your already published'
            })
            this.setState({
                logining: false
            })
            return
        }
        const oldState = this.state.published

        // publish localStream
        this.state.client.publish(this.state.localStream, function (err) {
            this.setState({
                published: oldState
            })
            console.log('publish failed')
            Toast.error('publish failed')
            console.error(err)
            this.setState({
                logining: false
            })
        })
        notification.info({
            message: 'publish'
        })
        this.setState({
            published: true
        })
    }
}

ReactDOM.render(<Root/>,
    document.getElementById('root'));
