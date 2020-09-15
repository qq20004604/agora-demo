/**
 * Created by 王冬 on 2019/5/23.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
import {get, post} from '../config/http';

const $ajax = {
    sendRegEmail (payload) {
        return post('/user/send_email_regcode/', payload);
    },
    register (payload) {
        return post('/user/register/', payload);
    },
    login (payload) {
        return post('/user/login/', payload);
    },
    had_logined () {
        return post('/user/had_logined/');
    },
    logout () {
        return post('/user/logout/');
    },
    groupListPublic (payload) {
        return post('/msg/group_list/load/', payload);
    },
    groupListAdd (payload) {
        return post('/msg/group_list/add/', payload);
    },
    groupMsgLoad (payload) {
        return post('/msg/load_msg_by_group/', payload);
    },
    addMsg (payload) {
        return post('/msg/add_msg/', payload);
    },
    get_user_name () {
        return post('/feeds/get_user_name/');
    },
    addFeed (payload) {
        return post('/feeds/send/', payload);
    },
    // 查看所有发布过消息的用户，以及他们最近发布的一条消息
    getUserList (payload = {
        page: 1
    }) {
        return post('/feeds/user/list/', payload);
    },
    // 查看某用户信息，以及他发布过的消息
    loadUserDetail (payload = {
        page: 1
    }) {
        return post('/feeds/user/pub/detail/', payload);
    },
    // 修改当前用户的信息（MsgPuber）
    puberInfoUpdate (payload) {
        return post('/feeds/user/pub/update/', payload);
    },
    // 查看当前登录用户详细信息，以及他发布过的消息
    loadSelfDetail (payload = {
        page: 1
    }) {
        return post('/feeds/user/self/', payload);
    },
    // 查询该 UP 主的订阅者列表
    loadSelfSuberList (payload = {
        page: 1
    }) {
        return post('/feeds/user/self/suberlist/', payload);
    },
    // 修改该 UP 主的某个订阅者是否能收取他的邮件
    setSuberRec (payload) {
        return post('/feeds/user/self/suber/rec/', payload);
    },
    // 以时间为顺序排序，查看某用户最近发布的消息
    loadFeedsList (payload = {
        page: 1
    }) {
        return post('/feeds/msg/all/', payload);
    },
    // 订阅某个消息up主
    subscribeFeeds (payload) {
        return post('/feeds/subscribe/', payload);
    },
    // 取消订阅某个消息up主
    unsubscribeFeeds (payload) {
        return post('/feeds/unsubscribe/', payload);
    },
    // 查看当前用户订阅的消息
    queryUserSubList (payload = {
        page: 1,
        sub_type: '01'
    }) {
        return post('/feeds/subscribe/detail/', payload);
    },
    // 修改用户订阅信息
    modifySubscribeInfo (payload) {
        return post('/feeds/subscribe/update/', payload);
    },
};

export default $ajax;
