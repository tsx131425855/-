import router from "./router";
import store from "./store";
// import { Message } from 'element-ui'
import NProgress from "nprogress"; // 进度条
import "nprogress/nprogress.css"; // 进度条样式
import getPageTitle from "@/utils/get-page-title";
// import settings from "./settings";
NProgress.configure({
  showSpinner: false
}); // NProgress配置
// const ss = settings.urlTesting;
// console.log(ss);
const whiteList = ["/login"]; // 无重定向白名单

router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start();
  // 设置页面标题
  document.title = getPageTitle(to.meta.title);
  // console.log(to.path);
  // 确定用户是否已登录
  const hasToken = localStorage.getItem("Token");
  if (hasToken) {
    if (to.path === "/login") {
      // 如果已登录，请重定向到主页
      next({ path: "/" });
      NProgress.done();
    } else {
      if (
        to.redirectedFrom &&
        to.redirectedFrom.indexOf("/tongshuangxiong") != -1
      ) {
        localStorage.setItem("Token", to.query.token);
        // this.$store.commit('SET_TOKEN', to.query.token)
        store.dispatch("userInfo").then(res => {
          next({ path: "/dashboard", replace: true });
        });
      } else {
        next();
      }
      // next();
    }
  } else if (
    to.redirectedFrom &&
    to.redirectedFrom.indexOf("/tongshuangxiong") != -1
  ) {
    localStorage.setItem("Token", to.query.token);
    store.dispatch("userInfo").then(res => {
      next({ path: "/dashboard", replace: true });
    });
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // 完成进度条
  NProgress.done();
});
