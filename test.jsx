/**
 * Created by 王冬 on 2020/9/15.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
const client = AgoraRTC.createClient({mode: 'live', codec: "h264"});

client.init(<APPID>, function () {
    console.log("AgoraRTC client initialized")
}, function (err) {
    console.log("AgoraRTC client init failed", err)
})
