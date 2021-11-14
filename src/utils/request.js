import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import NProgress from "nprogress"; // 进度条
import "nprogress/nprogress.css"; // 进度条样式
import { setToken } from "@/utils/auth";
import defaultSettings from "@/settings";
// create an axios instance
const service = axios.create({
    baseURL: defaultSettings.LinkPath,
    crewithdentials: false, // 跨域请求时发送cookies
    timeout: 10000 // request timeout
});

NProgress.configure({
    showSpinner: false
}); // NProgress配置

// request interceptor
service.interceptors.request.use(
    config => {
        // 在发出请求前做点什么
        NProgress.start();
        if (store.getters.token || localStorage.getItem("Token")) {
            // config.headers["token"] = localStorage.getItem("Token");
            // const toekn = localStorage.getItem("Token")
            // if (toekn) {
            //   if (config.method == "get") {
            //     config.params["token"] = toekn;
            //   }
            //   if (config.method == "post") {
            //     config.data = `${config.data}&token= ${toekn}`;
            //   }
            // }
        }
        return config;
    },
    error => {
        // do something with request error
        // console.log(error) // for debug
        return Promise.reject(error);
    }
);
// response interceptor
service.interceptors.response.use(
    /**
     * 请返回response=>response
     */

    response => {
        const res = response.data;
        NProgress.done();
        // console.log(res)
        if (res.code == 2) {
            Message({
                message: res.msg || "Error",
                type: "error",
                duration: 5 * 1000
            });
            if (res.token.length > 0) {
                localStorage.setItem("Token", res.token);
                setToken(res.token);
            } else {
                // Message({
                //   message: "缺少toekn",
                //   type: "error",
                //   duration: 5 * 1000
                // });
            }
            setTimeout(() => {
                store.dispatch("logout").then(() => {
                    location.reload(); //
                });
            }, 1000);
            return res;
        } else {
            if (res && res.token.length > 0) {
                localStorage.setItem("Token", res.token);
                setToken(res.token);
            } else {
                // Message({
                //   message: "缺少toekn",
                //   type: "error",
                //   duration: 5 * 1000
                // });
            }
            return res;
        }
    },
    error => {
        console.log("请求错误" + error); // for debug
        Message({
            message: "网络请求错误",
            type: "error",
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export default service;