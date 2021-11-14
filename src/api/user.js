import request from "@/utils/request";
import { exportFile } from "@/utils/user";
import qs from "qs";

export function gethttp(val = {}, url) {
  const Token = { token: localStorage.getItem("Token") };
  Object.assign(val, Token);
  return request({
    url,
    method: "get",
    params: val
  });
}
export function postHttp(val = {}, url) {
  const Token = { token: localStorage.getItem("Token") };
  Object.assign(val, Token);
  return request({
    url,
    method: "post",
    data: qs.stringify(val)
  });
}

/**
 *
 * @param {String} url 导出路由
 * @param {Object} params 携带的参数
 * @param {Boolean} auto 是否自动跳转(建议采用此方法)
 */
export function baseExport(url, params = {}, auto) {
  console.log(params);
  Object.assign(params, data);
  var str = exporteurl + url + "?";
  for (var k in params) {
    str += k + "=" + params[k] + "&";
  }
  if (auto) {
    return exportFile(str);
  } else {
    return str;
  }
}

// 获取用户信息
// export const getadmin = val => gethttp(val, "/home/index/getadmin");
export function getadmin(data) {
  return request({
    url: "/home/index/getadmin",
    method: "post",
    data: qs.stringify(data)
  });
}

export function login(data) {
  // 登录
  return request({
    url: "/index/login/login",
    method: "post",
    data: qs.stringify(data)
  });
}

export function logout() {
  // 登出
  return request({
    url: "/index/login/logout",
    method: "post"
  });
}

export function verification(val) {
  // 验证码
  const data = {
    phone: val
  };
  return request({
    url: "/index/login/sendcode",
    method: "post",
    data: qs.stringify(data)
  });
}

export function sidebar() {
  // 侧边栏
  const data = {
    token: localStorage.getItem("Token")
  };
  return request({
    url: "/home/index/menu",
    method: "post",
    data: qs.stringify(data)
  });
}

export function consoleList(val) {
  // 侧边栏
  const Token = { token: localStorage.getItem("Token") };
  Object.assign(val, Token);
  return request({
    url: "/statis/index/consoleList",
    method: "post",
    data: qs.stringify(val)
  });
}

// 省市区通用接口
export const Province = val => gethttp(val, "/area/index/index");

// 上传图片
export const upimg = "/home/index/upload2";
// 上传图片
export const upimg1 = "/home/index/upload2";
// 文件上传
export const upfile = "/home/index/uploadfile";

// 视频上传
export const upVideo = "/home/index/uploadvideo";
