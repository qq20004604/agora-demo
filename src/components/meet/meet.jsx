/**
 * Created by 王冬 on 2020/9/16.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import React, {useState, useEffect} from 'react';
import {notification, Button, Row, Col, Switch} from 'antd';
import AgoraRTC from 'common/js/AgoraRTCSDK.min.js';

function RemoteStream (props) {
    const {id, remoteStream} = props;
    // debugger;
    const domID = `local_stream_${id}`
    const DOM = <div id={domID} className="video-placeholder"></div>;
    useEffect(() => {
        remoteStream.play(domID)
    }, [])
    return <div>
        {
            DOM
        }
    </div>
}

function Meet (props) {
    const {remoteStreams, params, localStream} = props;
    const [isMuted, setMuted] = useState(false);
    return <div>
        <Row gutter={16}>
            <Col className="gutter-row" span={12}>
                <div>
                    <div id="local_stream" className="video-placeholder"></div>
                    {
                        localStream ? <div>
                            <Switch checkedChildren="打开麦克风" unCheckedChildren="关闭麦克风"
                                    checked={isMuted}
                                    onClick={isChecked => {
                                        if (isChecked) {
                                            localStream.adjustAudioMixingVolume(0);
                                            localStream.muteAudio()
                                        } else {
                                            localStream.adjustAudioMixingVolume(50);
                                            localStream.unmuteAudio()

                                        }
                                        setMuted(isChecked)
                                    }}/>

                        </div> : null
                    }
                </div>
            </Col>
            {
                remoteStreams.map(remoteStream => {
                    let id = remoteStream.getId();
                    if (id !== params.id) {
                        return <Col className="gutter-row" span={12} key={id}>
                            <RemoteStream remoteStream={remoteStream} id={id}/>
                        </Col>
                    } else {
                        return null
                    }
                })
            }
        </Row>
    </div>
}

export default Meet
