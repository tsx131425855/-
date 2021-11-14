import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";
// import "babel-polyfill";
import "@/icons"; // icon
import "@/permission"; // permission control
// require("babel-polyfill");
import BaiduMap from "vue-baidu-map";
import VueClipboard from "vue-clipboard2";
// set ElementUI lang to EN
Vue.use(ElementUI, { locale, size: "small", zIndex: 3000 });
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: "jAAuSYbA4hKsWGZjub9mGZrPR9ABP4ao"
});
Vue.config.productionTip = false;

Vue.use(VueClipboard);
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
