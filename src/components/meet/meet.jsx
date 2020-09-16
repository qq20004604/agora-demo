/**
 * Created by 王冬 on 2020/9/16.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import React, {useState, useEffect} from 'react';
import {notification, Button, Row, Col} from 'antd';

function RemoteStream (props) {
    const {id, remoteStream} = props;
    // debugger;
    const domID = `local_stream_${id}`
    const DOM = <div id={domID} className="video-placeholder"></div>;
    useEffect(() => {
        remoteStream.play(domID)
    }, [])
    return DOM
}

function Meet (props) {
    const {remoteStreams, params} = props;
    return <div>
        <Row gutter={16}>
            <Col className="gutter-row" span={12}>
                <div id="local_stream" className="video-placeholder"></div>
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
