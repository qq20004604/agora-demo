/**
 * Created by 王冬 on 2020/6/15.
 * QQ: 20004604
 * weChat: qq20004604
 * 功能说明：
 *
 */
const utils = {
    // 设置URL的search字符串。注意，这里没有设计转义处理
    // 另一种传参情况参考下面
    setSearchUrl(k, v) {
        const searchStr = window.location.search;

        if (searchStr.length <= 1) {
            window.location.search = `${k}=${v}`;
            return;
        }
        const searchList = searchStr.slice(1).split('&').map(kv => kv.split('='))
        const m = new Map(searchList);
        m.set(k, v)
        // 生成新的search字符串
        const newSearchStr = [...m].map(kvList => `${kvList[0] ? kvList[0] : ''}=${kvList[1] ? kvList[1] : ''}`).join('&');
        // 修改url
        window.location.search = `${newSearchStr}`
    },

    // 设置search字符串（同时设置多个）
    // 调用方法 setSearchUrlMultiple(['第一个key', '第一个key对应的value'], ['第二个key', '第二个key对应的value'] )
    // 如果值为空，则相当于删除这个字段
    setSearchUrlMultiple() {
        const searchStr = window.location.search;
        // 先拿到所有的数组
        const argsList = [...arguments];

        // 为空时，直接设置，这个最简单
        if (searchStr.length <= 1) {
            const str = argsList.map(kvList => `${kvList[0] ? kvList[0] : ''}=${kvList[1] ? kvList[1] : ''}`).join("&")

            window.location.search = str;
            return;
        }

        // 开始考虑已有search字符串时的处理
        const searchList = searchStr.slice(1).split('&');

        // 用map自动去重，省事
        const m = new Map();
        searchList.forEach(kv => {
            const kvList = kv.split('=')
            if (kvList[1] !== undefined) {
                m.set(kvList[0], kvList[1])
            }
        })
        argsList.forEach(kvList => {
            if (kvList[1] !== undefined) {
                m.set(kvList[0], kvList[1])
            } else {
                m.delete(kvList[0])
            }
        })
        // 如果没遇见，则直接在
        // 生成新的search字符串
        const newSearchStr = [...m].map(kvList => `${kvList[0]}=${kvList[1]}`).join("&")
        // 修改url
        window.location.search = `${newSearchStr}`
    },

    // 从search字符串里读值
    getFromSearchURL(k) {
        let v = null;
        const searchStr = window.location.search;
        if (searchStr.length > 1) {
            // 先拿到kv数组
            const searchList = searchStr.slice(1).split('&')
            searchList.forEach(kv => {
                const kvList = kv.split('=');
                if (kvList[0] === k) {
                    v = kvList[1]
                }
            })
        }
        return v
    },

    // 删除search字符串的某个url
    clearSearchUrl(k) {
        const searchStr = window.location.search;
        if (searchStr.length <= 1) {
            return;
        }
        const searchList = searchStr.slice(1).split('&');
        // 遍历，如果遇见则修改
        const newSearchList = searchList.filter(kv => {
            const kvList = kv.split('=')
            // 匹配到则修改并返回
            if (kvList[0] === k) {
                return false;
            }
            // 没匹配到则返回默认的
            return true
        })
        // 生成新的search字符串
        const newSearchStr = newSearchList.join('&');
        if (newSearchStr.length > 0) {
            // 修改url
            window.location.search = `${newSearchStr}`
        } else {
            // 修改url
            window.location.search = ``
        }
    },

    // 设置URL的hash字符串。注意，这里没有设计转义处理
    setHashUrl(k, v) {
        const searchStr = window.location.hash;
        const searchList = searchStr.slice(1).split('&');
        let isInThis = false;
        // 遍历，如果遇见则修改
        const newSearchList = searchList.map(kv => {
            const kvList = kv.split('=')
            // 匹配到则修改并返回
            if (kvList[0] === k) {
                isInThis = true;
                kvList[1] = v;
                return `${k}=${v}`
            }
            // 没匹配到则返回默认的
            return kv
        })
        // 如果没遇见，则直接在后面加一组数据
        if (!isInThis) {
            newSearchList.push(`${k}=${v}`);
        }
        // 生成新的search字符串
        const newSearchStr = newSearchList.join('&');
        // 修改url
        window.location.hash = `${newSearchStr}`
    },

    // 从search字符串里读值
    getFromHashURL(k) {
        let v = null;
        const searchStr = window.location.hash;
        if (searchStr.length > 1) {
            // 先拿到kv数组
            const searchList = searchStr.slice(1).split('&')
            searchList.forEach(kv => {
                const kvList = kv.split('=');
                if (kvList[0] === k) {
                    v = kvList[1]
                }
            })
        }
        return v
    }
}
export default utils
