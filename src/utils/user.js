import defaultSettings from "@/settings";
import { array } from "js-md5";
/**
 * 传送数据
 */
export function userData(str) {
    // localStorage.setItem("userData",data)
    // const userData = localStorage.getItem('userData')
    const obj = {};
    Object.assign(obj, str);
    return obj;
}


/**
 * 数据类型判断
 */
export function JudgmentType(val) {
    //  不能判断 object
    return typeof val;
}


export const exporteurl = defaultSettings.LinkPath;

export function turnDate(str, yms) {
    if (str && str instanceof Date) {
        const date = str;
        const year = date.getFullYear();
        const month =
            date.getMonth() + 1 < 10 ?
            "0" + (date.getMonth() + 1) :
            date.getMonth() + 1;
        const strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const hours =
            date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        const minutes =
            date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        const seconds =
            date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        if (yms == "1") {
            const obj = year + "-" + month + "-" + strDate;
            return obj;
        } else if (yms == "2") {
            const obj = hours + ":" + minutes;
            return obj;
        } else {
            const obj =
                year +
                "-" +
                month +
                "-" +
                strDate +
                " " +
                hours +
                ":" +
                minutes +
                ":" +
                seconds;
            return obj;
        }
    } else return str;
}

/** 每个月第一天 */
export function monthOne(val) {
    const curDate = new Date();
    // const date = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
    const date = new Date();
    const year = date.getFullYear();
    const month =
        date.getMonth() + 1 < 10 ?
        "0" + (date.getMonth() + 1) :
        date.getMonth() + 1;
    let obj = year + "-" + month + "-01";
    if (val == 1) obj = year + "-" + month + "-01" + " 00:00:00";
    return obj;
}

/** 当前时间的前一天 */
export function sameDay(val) {
    const curDate = new Date();
    const date = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const month =
        date.getMonth() + 1 < 10 ?
        "0" + (date.getMonth() + 1) :
        date.getMonth() + 1;
    const strDate = date.getDate();
    let obj = year + "-" + month + "-" + strDate;
    if (val == 1) obj = year + "-" + month + "-" + strDate + " 00:00:00";
    return obj;
}

/** 当前时间的前两天天 */
export function Day() {
    const curDate = new Date();
    const date = new Date(curDate.getTime() - 48 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const month =
        date.getMonth() + 1 < 10 ?
        "0" + (date.getMonth() + 1) :
        date.getMonth() + 1;
    const strDate = date.getDate();
    const obj = year + "-" + month + "-" + strDate;
    return obj;
}
/** 当前时间前一天传1 */
export function gittiem(val) {
    const curDate = new Date();
    let obj = "";
    if (val == 1) {
        const date = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
        const year = date.getFullYear();
        const month =
            date.getMonth() + 1 < 10 ?
            "0" + (date.getMonth() + 1) :
            date.getMonth() + 1;
        const strDate = date.getDate();
        obj = year + "-" + month + "-" + strDate;
        return obj;
    } else if (val == 2) {
        const date = new Date(curDate.getTime() - 48 * 60 * 60 * 1000);
        const year = date.getFullYear();
        const month =
            date.getMonth() + 1 < 10 ?
            "0" + (date.getMonth() + 1) :
            date.getMonth() + 1;
        const strDate = date.getDate();
        obj = year + "-" + month + "-" + strDate;
        return obj;
    } else {
        const year = curDate.getFullYear();
        const month =
            curDate.getMonth() + 1 < 10 ?
            "0" + (curDate.getMonth() + 1) :
            curDate.getMonth() + 1;
        const strDate = curDate.getDate();
        // const hours = (curDate.getHours() < 10 ? '0' + curDate.getHours() : curDate.getHours())
        // const minutes = (curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : curDate.getMinutes())
        // const seconds = (curDate.getSeconds() < 10 ? '0' + curDate.getSeconds() : curDate.getSeconds())
        obj = year + "-" + month + "-" + strDate;
        return obj;
    }
}

export function exportFile(url) {
    window.open(
        url,
        "就呢度",
        "toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes, status=yes, fullscreen=yes,height=500px,width=1500px,top=150px,left=250px, location=yes",
        "_top"
    );
}

export function urlTesting() {
    const location = window.location.host;
    if (
        location.indexOf("devadminnew.jiunidu.com") != -1 ||
        location.indexOf("preadminnew.jiunidu.com") != -1 ||
        location.indexOf("adminnew.jiunidu.com") != -1
    ) {
        /** 总后台：devadminnew.jiunidu.com */
        return { index: 1, title: "就呢度后台管理系统" };
    } else if (
        location.indexOf("devagent.jiunidu.com") != -1 ||
        location.indexOf("preagent.jiunidu.com") != -1 ||
        location.indexOf("agent.jiunidu.com") != -1
    ) {
        /** 代理商后台：devagent.jiunidu.com */
        return { index: 2, title: "就呢度代理商后台管理系统" };
    } else if (
        location.indexOf("devpartner.jiunidu.com") != -1 ||
        location.indexOf("prepartner.jiunidu.com") != -1 ||
        location.indexOf("partner.jiunidu.com") != -1
    ) {
        /** 合伙人后台：devpartner.jiunidu.com */
        return { index: 3, title: "就呢度合伙人后台管理系统" };
    } else if (
        location.indexOf("devvillage.jiunidu.com") != -1 ||
        location.indexOf("previllage.jiunidu.com") != -1 ||
        location.indexOf("village.jiunidu.com") != -1
    ) {
        /** 负责人后台：devvillage.jiunidu.com */
        return { index: 4, title: "就呢度负责人后台管理系统" };
    } else {
        return { index: 5, title: "" };
    }
}

/** 数组偏移 1网右移移位  2往左移一位 */
export function arrDisplacement(val, arr, index) {
    if (val == 1) {
        if (arr.length - 1 > index) {
            arr[index] = arr.splice(index + 1, 1, arr[index])[0];
        }
    } else if (val == 2) {
        if (index > 0) {
            arr[index] = arr.splice(index - 1, 1, arr[index])[0];
        }
    }
    return arr;
}
/** Object.assign  出现的问题 */
export function CopyObject(val) {
    return JSON.parse(JSON.stringify(val));
}

/** 数组置顶 */
export function arrRoofPlacement(arr, index) {
    arr.unshift(arr[index]);
    arr.splice(index + 1, 1);
    return arr;
}

/** 判断各个浏览器 */
export function myBrowser() {
    const ua = navigator.userAgent.toLocaleLowerCase();
    console.log(ua);
    let browserType = null;
    if (ua.match(/msie/) != null || ua.match(/trident/) != null) {
        browserType = "IE";
    }
    if (ua.match(/firefox/) != null) {
        browserType = "火狐";
    }
    if (ua.match(/ubrowser/) != null) {
        browserType = "UC";
    }
    if (ua.match(/opera/) != null) {
        browserType = "欧朋";
    }
    if (ua.match(/bidubrowser/) != null) {
        browserType = "百度";
    }
    if (ua.match(/safari/) != null) {
        browserType =
            "Safari"; /** 使用了KDE的KHTML作为浏览器的运算核心。 就是苹果浏览器 */
    }
    if (ua.indexOf("android") > -1) {
        browserType = "android安卓";
    }
    if (ua.indexOf("linux") > -1) {
        browserType = "android安卓";
    }
    if (ua.indexOf("iphone") > -1) {
        browserType = "iPhone";
    }
    if (ua.indexOf("ipad") > -1) {
        browserType = "iPad";
    }
    if (ua.indexOf("linux") > -1) {
        browserType = "android安卓";
    }
    if (ua.match(/metasr/) != null) {
        browserType = "搜狗";
    }
    if (ua.indexOf("qqbrowser") > -1) {
        browserType = "QQ";
    }
    if (ua.match(/maxthon/) != null) {
        browserType = "遨游";
    }
    if (ua.match(/chrome/) != null) {
        const _mime = (option, value) => {
            var mimeTypes = navigator.mimeTypes;
            for (var mt in mimeTypes) {
                if (mimeTypes[mt][option] == value) {
                    return true;
                }
            }
            return false;
        };
        const is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
        if (is360) browserType = "360";
    }
    return browserType;
}

/** pc下载 iframe */
export function downloadfile(url) {
    var elemIF = document.createElement("iframe");
    elemIF.src = url;
    elemIF.style.display = "none";
    document.body.appendChild(elemIF);
}

/** pc下载 a */
export function downloadAFile(url) {
    const urlarr = window.URL.createObjectURL(new Blob([url])); // 创建下载链接
    const link = document.createElement("a"); // 创建a标签
    link.style.display = "none"; // 将a标签隐藏
    link.href = urlarr; // 给a标签添加下载链接
    link.setAttribute("download", "下载mp4"); // 此处注意，要给a标签添加一个download属性，属性值就是文件名称 否则下载出来的文件是没有属性的，空白白
    document.body.appendChild(link);
    link.click(); // 执行a标签
}

/** 判断数组中的时间 */
export function conversiontime(arr, index) {
    let start_time = "";
    let end_time = "";
    if (arr instanceof Array && arr.length > 0) {
        if (arr[0] instanceof Date) {
            start_time = turnDate(arr[0], index);
        } else start_time = arr[0];
        if (arr[1] instanceof Date) {
            end_time = turnDate(arr[1], index);
        } else end_time = arr[1];
        return { start_time, end_time };
    } else return { start_time, end_time };
}

/**
 *数组对象去重赋值
 *
 * @export
 * @param {*} arr1 需要赋值的参数
 * @param {*} arr2
 */
export function arrayObjectDuplication(arr1, arr2) {
    if (arr1 instanceof Array && arr1.length > 0) {
        let ss = arr1.flatMap(x => [x.url]);
        if (arr2 instanceof Array && arr2.length > 0) {
            arr2.map(val => {
                if (!ss.includes(val.url)) {
                    arr1.push({ url: val.url, text: "" });
                }
            });
            return arr1;
        }
        return;
    } else {
        arr1 = [];
        if (arr2 instanceof Array && arr2.length > 0) {
            arr2.map(val => {
                arr1.push({ url: val.url, text: "" });
            });
            return arr1;
        }
    }
}